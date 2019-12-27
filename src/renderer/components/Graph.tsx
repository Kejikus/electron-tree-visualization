import * as React from "react";
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import {ipcRenderer} from 'electron';
// @ts-ignore
import {permutations} from '@aureooms/js-permutation/src/permutations';


// @ts-ignore
import cyStyle from '../text/cytoscape.txt.css';


const layout: cytoscape.CoseLayoutOptions | cytoscape.LayoutOptions = {
    name: 'cose',
    animate: false,
    gravity: 2,
    nodeOverlap: 1,
    nestingFactor: 0.5,
    randomize: true,
    // idealEdgeLength: edge => 0,
    // edgeElasticity: edge => 100,
    // nodeRepulsion: node => 10000,
    // componentSpacing: 10000
};

const settings: cytoscape.CytoscapeOptions = {
    layout: layout,
    style: cyStyle
};

const town_count = "town_count";
const town_distance_matrix = "town_distance_matrix";
const start_point_distances = "start_point_distances";
const town_marks = "ABCDEFGHIJ";

interface InputObject {
    town_count: number;
    town_distance_matrix: Array<Array<number | null>>;
    start_point_distances: Array<number | null>;
}


export class Graph extends React.Component {

    private cy: cytoscape.Core;
    private cyContainer: React.RefObject<HTMLDivElement> = React.createRef();
    private graph: cytoscape.ElementsDefinition = {
        nodes: [],
        edges: []
    };
    private town_count: number = 0;

    constructor(props: any) {
        super(props);

        this.cy = cytoscape();
    }

    componentDidMount(): void {
        this.cy = cytoscape(Object.assign({
            container: this.cyContainer.current,
            elements: this.graph
        }, settings));

        console.log(this.cy);
    }

    readJson(content: string): boolean {
        let json: InputObject;

        try {
            json = JSON.parse(content);
        } catch (e) {
            console.log("Invalid JSON format.");
            console.log(e);
            return false;
        }

        this.graph.nodes.splice(0, this.graph.nodes.length);
        this.graph.edges.splice(0, this.graph.edges.length);
        this.cy.remove("*");

        try {
            this.town_count = json.town_count;

            this.graph.nodes.push({
                group: "nodes",
                data: {
                    id: "-1",
                    label: "START"
                }
            });

            for (let i = 0; i < json.town_count; i++) {
                this.graph.nodes.push({
                    group: "nodes",
                    data: {
                        id: i.toString(),
                        label: town_marks[i % town_marks.length]
                    },
                });

                if (json.start_point_distances[i] != null) {
                    this.graph.edges.push({
                        group: "edges",
                        data: {
                            id: `-1_${i}`,
                            source: "-1",
                            target: i.toString(),
                            weight: json.start_point_distances[i]
                        }
                    });
                    this.graph.edges.push({
                        group: "edges",
                        data: {
                            id: `${i}_-1`,
                            source: i.toString(),
                            target: "-1",
                            weight: json.start_point_distances[i]
                        }
                    });
                }

                for (let j = 0; j < json.town_count; j++) {
                    if (i != j && json.town_distance_matrix[i][j] != null)
                        this.graph.edges.push({
                            group: "edges",
                            data: {
                                id: `${i}_${j}`,
                                source: i.toString(),
                                target: j.toString(),
                                weight: json.town_distance_matrix[i][j]
                            }
                        });
                }
            }
        } catch (e) {
            this.town_count = 0;
            console.log("Error reading file");
            console.log(e);
            return false;
        }

        return true;
    }

    openFile() {
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.once('opened-file-content', (event1, ...args) => {
            if (args.length > 0) {
                if (!this.readJson(args[0])) {
                    this.graph.nodes.splice(0, this.graph.nodes.length);
                    this.graph.edges.splice(0, this.graph.edges.length);
                } else {
                    this.cy.add(this.graph.nodes);
                    this.cy.add(this.graph.edges);
                    this.cy.layout(layout).run();
                    this.cy.fit();
                }
            }
        });
    }

    routeLength(...id: number[]): number | null {

        let len = 0;

        try {
            let el = this.cy.$id(`-1_${id[0]}`);
            if (el.length < 1) return null;
            len += el.data().weight;
            for (let i = 0; i < id.length - 1; i++) {
                el = this.cy.$id(`${id[i]}_${id[i+1]}`);
                if (el.length < 1) return null;
                len += el.data().weight;
            }
            el = this.cy.$id(`${id[id.length-1]}_-1`);
            if (el.length < 1) return null;
            len += el.data().weight;
        } catch (e) {
            return null;
        }

        return len;
    }

    findRoute() {
        console.log(this.cy);
        let current_perm = [];
        for (let i = 0; i < this.town_count; i++) current_perm.push(i);

        let iter = permutations(this.town_count);

        let minLen = null;
        let minPerm = null;

        while (true) {
            let perm = iter.next();
            if (perm.done) break;
            let len = this.routeLength(...perm.value);
            if (len != null && (minLen == null || len < minLen)) {
                minLen = len;
                minPerm = perm.value;
            }
        }

        console.log(minPerm);
        console.log(minLen);

        if (minPerm != null) {
            let coll = this.cy.collection();
            coll = coll.union(this.cy.$("#-1"));
            coll = coll.union(this.cy.$(`#-1_${minPerm[0]}`));
            for (let i = 0; i < minPerm.length; i++) {
                coll = coll.union(this.cy.$(`#${minPerm[i]}`));
                if (i > 0)
                    coll = coll.union(this.cy.$(`#${minPerm[i-1]}_${minPerm[i]}`));
            }
            coll = coll.union(this.cy.$(`#${minPerm[minPerm.length-1]}_-1`));
            coll.toggleClass('selected', true);
            // coll.select();
            console.log(coll);
        }
    }

    render(): React.ReactElement {
        return (
            <div ref={this.cyContainer} style={{height: "62vh", border: "1px solid black"}}/>
        );
    }
}
