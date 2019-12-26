import React, {Component, ReactNode} from "react";
import {BinarySearchTree} from "../structures/BinarySearchTree";

import {BinaryTree} from "../components/BinaryTree";


export interface BinaryTreeLabState {
    tree: BinarySearchTree
}


export default class AVLTreeLab extends Component<{}, BinaryTreeLabState> {
    private valueInput = React.createRef<HTMLInputElement>();
    private addBtn = React.createRef<HTMLButtonElement>();
    private removeBtn = React.createRef<HTMLButtonElement>();
    private highlightBtn = React.createRef<HTMLButtonElement>();
    private generateBtn = React.createRef<HTMLButtonElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            tree: new BinarySearchTree()
        }
    }

    componentDidMount(): void {
        let add = this.addBtn.current;
        let remove = this.removeBtn.current;
        let highlight = this.highlightBtn.current;
        let generate = this.generateBtn.current;
        let valueInp = this.valueInput.current;
        if (add != null) add.onclick = (e) => {
            if (valueInp != null) {
                this.state.tree.addValue(parseInt(valueInp.value), true);
                this.forceUpdate();
            }
        };

        if (remove != null) remove.onclick = (e) => {
            if (valueInp != null) {
                this.state.tree.removeValue(parseInt(valueInp.value), true);
                this.forceUpdate();
            }
        };

        if (highlight != null) highlight.onclick = (e) => {
            if (valueInp != null) {
                let inp = parseInt(valueInp.value);
                this.state.tree.highlightLess(inp);
                this.forceUpdate();
                setTimeout(() => {
                    this.state.tree.highlightLess(inp, false);
                    this.forceUpdate();
                }, 3000);
            }
        };

        if (generate != null) generate.onclick = (e) => {
            if (valueInp != null) {
                let inp = parseInt(valueInp.value);
                this.state.tree.generateRandom(inp);
                this.forceUpdate();
            }
        };
    }

    render(): ReactNode {

        return (
            <div className="container">
                <div className="row valign-wrapper">
                    <div className="input-field col s3">
                        <input type="number" id="a" ref={this.valueInput}/>
                        {/*<label htmlFor="a">Value</label>*/}
                    </div>
                    <div className="col s7">
                        <div className="valign-wrapper">
                            <button className="btn-small waves-effect waves-light blue" ref={this.addBtn}>Add</button>
                            <button className="btn-small waves-effect waves-light blue" ref={this.removeBtn}>Remove</button>
                            <button className="btn-small waves-effect waves-light blue" ref={this.highlightBtn}>Highlight</button>
                            <button className="btn-small waves-effect waves-light blue" ref={this.generateBtn}>Generate</button>
                        </div>
                    </div>
                    <div className="col s2">Height: {this.state.tree.root != null ? this.state.tree.root.height() : 0}</div>
                </div>
                <BinaryTree tree={this.state.tree.root}/>
            </div>
        );
    }
}
