import React, { Component } from 'react';
import ReactDOM from "react-dom";

import {TreeNode} from "./structures/BinarySearchTree";
import BinaryTreeLab from "./views/BinaryTreeLab";

import M from 'materialize-css';

import 'materialize-css/sass/materialize.scss';
import AVLTreeLab from "./views/AVLTreeLab";

class App extends Component {

	private tabsRef: React.RefObject<HTMLUListElement> = React.createRef<HTMLUListElement>();

	componentDidMount(): void {
		if (this.tabsRef.current != null) {
			let instance = M.Tabs.init(this.tabsRef.current);
			instance.select('tab1');
		}
	}

	render() {

		console.log('render main');

		function node(value: number, leftNode: TreeNode | null = null, rightNode: TreeNode | null = null) {
			return new TreeNode(value, leftNode, rightNode)
		}

		return (
			<div className="container">
				<header className="card-panel">
					3 in 1 labs
				</header>
				<div className="row">
					<div className="col s12">
						<ul className="tabs" ref={this.tabsRef}>
							<li className="tab col s6"><a href="#tab1" className="active">Binary tree</a></li>
							<li className="tab col s6"><a href="#tab2">AVL Tree</a></li>
						</ul>
					</div>
					<div id="tab1" className="col s12"><BinaryTreeLab/></div>
					<div id="tab2" className="col s12"><AVLTreeLab/></div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
