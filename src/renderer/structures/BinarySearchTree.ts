
export class TreeNode {
    public parent: TreeNode | null;
    public value: number;
    public balanceFactor: number;
    public leftNode: TreeNode | null;
    public rightNode: TreeNode | null;
    public highlighted: boolean;

    constructor(value: number = 0, parent: TreeNode | null = null,
                leftNode: TreeNode | null = null, rightNode: TreeNode | null = null)
    {
        this.value = value;
        this.parent = parent;
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.highlighted = false;
        this.balanceFactor = 0;
    }

    addLeftNode(value: number): TreeNode {
        if (this.leftNode != null) throw Error('Cannot override left subtree link.');
        this.leftNode = new TreeNode(value, this);
        return this.leftNode;
    }

    addRightNode(value: number): TreeNode {
        if (this.rightNode != null) throw Error('Cannot override right subtree link.');
        this.rightNode = new TreeNode(value, this);
        return this.rightNode;
    }

    removeLeftNode(): TreeNode | null {
        let ret = this.leftNode;
        this.leftNode = null;
        return ret;
    }

    removeRightNode(): TreeNode | null {
        let ret = this.rightNode;
        this.rightNode = null;
        return ret;
    }

    detach(): TreeNode | null {
        if (this.parent == null) return null;

        let ret = this.parent;

        if (this == this.parent.leftNode) this.parent.leftNode = null;
        else if (this == this.parent.rightNode) this.parent.rightNode = null;
        else throw Error('Parent link broken - cannot detach node from wrong parent.');

        this.parent = null;

        return ret;
    }

    attach(parent: TreeNode | null) {
        if (parent == null) {
            this.detach();
            return;
        }

        if ((parent.value > this.value && parent.leftNode != null) || (parent.value < this.value && parent.rightNode != null))
            throw Error('Cannot attach node to non-empty subtree of new parent.');

        if (this.parent != null) this.detach();

        if (parent.value > this.value) parent.leftNode = this;
        else parent.rightNode = this;

        this.parent = parent;
    }

    first(): TreeNode {
        let ptr: TreeNode = this;

        while (ptr.leftNode != null) ptr = ptr.leftNode;

        return ptr;
    }

    next(): TreeNode | null {
        let ptr: TreeNode = this;

        if (ptr.parent == null) return null;

        if (ptr.parent.rightNode == ptr) return ptr.parent;

        if (ptr.parent.leftNode == ptr) {
            if (ptr.parent.rightNode != null)
                return ptr.parent.rightNode.first();
            else
                return ptr.parent;
        }

        return null;
    }


    balance(): boolean {
        if (this.balanceFactor > 1) {
            if (this.leftNode != null && this.leftNode.balanceFactor <= 0) {  // Small right
                let leftRoot = this.leftNode;
                let centralSubtree = this.leftNode.rightNode;
                let parent = this.detach();
                leftRoot.detach();
                if (centralSubtree != null) {
                    centralSubtree.detach();
                    centralSubtree.attach(this);
                }
                this.attach(leftRoot);
                leftRoot.attach(parent);
            } else {
                let leftRoot = this.leftNode;
                let lrRoot = leftRoot != null ? leftRoot.rightNode : null;
                let clSubtree = lrRoot != null ? lrRoot.leftNode : null;
                let crSubtree = lrRoot != null ? lrRoot.rightNode : null;
                let parent = this.detach();
                if (leftRoot != null) {
                    leftRoot.detach();
                    if (lrRoot != null) {
                        lrRoot.detach();
                        if (clSubtree != null) {
                            clSubtree.detach();
                            clSubtree.attach(leftRoot);
                        }
                        if (crSubtree != null) {
                            crSubtree.detach();
                            crSubtree.attach(this);
                        }
                        lrRoot.attach(parent);
                    }
                    leftRoot.attach(lrRoot);
                }
                this.attach(lrRoot);
            }
            return true;
        } else if (this.balanceFactor < -1) {
            if (this.rightNode != null && this.rightNode.balanceFactor >= 0) {  // Small right
                let rightRoot = this.rightNode;
                let centralSubtree = this.rightNode.leftNode;
                let parent = this.detach();
                rightRoot.detach();
                if (centralSubtree != null) {
                    centralSubtree.detach();
                    centralSubtree.attach(this);
                }
                this.attach(rightRoot);
                rightRoot.attach(parent);
            } else {
                let rightRoot = this.rightNode;
                let rlRoot = rightRoot != null ? rightRoot.leftNode : null;
                let clSubtree = rlRoot != null ? rlRoot.leftNode : null;
                let crSubtree = rlRoot != null ? rlRoot.rightNode : null;
                let parent = this.detach();
                if (rightRoot != null) {
                    rightRoot.detach();
                    if (rlRoot != null) {
                        rlRoot.detach();
                        if (clSubtree != null) {
                            clSubtree.detach();
                            clSubtree.attach(this);
                        }
                        if (crSubtree != null) {
                            crSubtree.detach();
                            crSubtree.attach(rightRoot);
                        }
                        rlRoot.attach(parent);
                    }
                    rightRoot.attach(rlRoot);
                }
                this.attach(rlRoot);
            }
            return true;
        }

        return false;
    }


    updateIndex(): number {
        let rIndex = 0;
        let lIndex = 0;

        if (this.leftNode != null)
            lIndex = this.leftNode.updateIndex();
        if (this.rightNode != null)
            rIndex = this.rightNode.updateIndex();

        this.balanceFactor = lIndex - rIndex;

        if (this.balance()) this.updateIndex();

        return Math.max(lIndex, rIndex) + 1;
    }
}

export class BinarySearchTree {
    public root: TreeNode | null;

    constructor(root: TreeNode | null = null) {
        this.root = root;
    }

    addValue(value: number): TreeNode {
        if (this.root == null) {
            this.root = new TreeNode(value);
            return this.root;
        }

        let pointer = this.root;

        while (true) {
            if (value == pointer.value) return pointer;

            if (value < pointer.value) {
                if (pointer.leftNode != null) {
                    pointer = pointer.leftNode;
                } else {
                    return pointer.addLeftNode(value);
                }
            } else {
                if (pointer.rightNode != null) {
                    pointer = pointer.rightNode;
                } else {
                    return pointer.addRightNode(value);
                }
            }
        }
    }

    removeValue(value: number) {
        if (this.root == null) return;

        let pointer: TreeNode | null = this.root;

        while (pointer != null) {
            if (value == pointer.value) {
                let parent = pointer.detach();

                let lNode = pointer.leftNode;
                let rNode = pointer.rightNode;

                if (lNode == null && rNode == null) break;

                if (rNode == null) {
                    // @ts-ignore
                    lNode.attach(parent);
                    pointer = lNode;
                }
                else if (lNode == null) {
                    rNode.attach(parent);
                    pointer = rNode;
                }
                else {
                    let rPointer = rNode;

                    while (rPointer.leftNode != null) rPointer = rPointer.leftNode;

                    lNode.attach(rPointer);
                    rNode.attach(parent);
                    pointer = rNode;
                }

                if (parent == null) this.root = pointer;

                pointer = null;
            } else {
                if (value < pointer.value) pointer = pointer.leftNode;
                else pointer = pointer.rightNode;
            }
        }
    }

    highlightValue(value: number, turn_on: boolean = true) {
        if (this.root == null) return;

        let pointer: TreeNode | null = this.root;

        while (pointer != null && pointer.value != value) {
            if (value < pointer.value) pointer = pointer.leftNode;
            else pointer = pointer.rightNode;
        }

        if (pointer != null) {
            pointer.highlighted = turn_on;
        }
    }
}
