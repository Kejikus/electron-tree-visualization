import * as React from "react";
import {Component, ReactElement} from "react";
import {Graph} from "../components/Graph";


export class TSPLab extends Component {

    private openBtn: React.RefObject<HTMLButtonElement> = React.createRef();
    private findBtn: React.RefObject<HTMLButtonElement> = React.createRef();
    private graphRef: React.RefObject<Graph> = React.createRef();

    componentDidMount(): void {
        let graph = this.graphRef.current;
        if (this.openBtn.current != null)
            this.openBtn.current.onclick = ev => {
                if (graph != null)
                    graph.openFile();
            };

        if (this.findBtn.current != null)
            this.findBtn.current.onclick = ev => {
                if (graph != null)
                    graph.findRoute();
            };
    }

    render(): ReactElement {
        return (
            <div>
                <div className="row valign-wrapper">
                    <div className="row col s12">
                        <button className="btn-small waves-effect waves-light blue col s6" ref={this.openBtn}>Open file</button>
                        <button className="btn-small waves-effect waves-light blue col s6" ref={this.findBtn}>Find path</button>
                    </div>
                </div>
                <Graph ref={this.graphRef}/>
            </div>
        );
    }
}
