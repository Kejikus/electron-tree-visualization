import React, {Component} from "react";
import {TreeNode} from "../structures/BinarySearchTree";


import "./BinaryTree.sass";

export interface BinaryTreeProps {
    tree: TreeNode | null;
}


export class BinaryTree extends Component<BinaryTreeProps, {}> {

    constructor(props: any) {
        super(props);
    }

    static generateTree(tree: TreeNode, className: string): JSX.Element {

        const empty = tree.leftNode == null && tree.rightNode == null;
        const full = tree.leftNode != null && tree.rightNode != null;
        const light = tree.highlighted;

        return (
            <div className={className + " node-wrapper"}>
                <div className={"node " + (empty ? "empty" : "") + (full ? "full" : "") + (light ? " highlight" : "")}>{tree.value}</div>
                <div className="links">
                    {tree.rightNode != null ? this.generateTree(tree.rightNode, "right-node") : ""}
                    {tree.leftNode != null ? this.generateTree(tree.leftNode, "left-node") : ""}
                </div>
            </div>
        )
    }

    render(): any {
        return (
            <div className="tree-root">
                {this.props.tree != null ? BinaryTree.generateTree(this.props.tree, "") : "No tree"}
            </div>
        );
    }
}

