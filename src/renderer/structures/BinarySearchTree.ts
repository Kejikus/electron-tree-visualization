
export class TreeNode {
    public parent: TreeNode | null;
    public value: number;
    // public balanceFactor: number;
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
        // this.balanceFactor = 0;
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

    removeRightNode(balance: boolean = false): TreeNode | null {
        let ret = this.rightNode;
        this.rightNode = null;
        return ret;
    }

    detach(): TreeNode | null {
        if (this.parent == null) return null;

        let ret = this.parent;

        if (this == this.parent.leftNode) this.parent.removeLeftNode();
        else if (this == this.parent.rightNode) this.parent.removeRightNode();
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

        if (ptr.rightNode != null) return ptr.rightNode.first();

        while (ptr.parent != null && ptr == ptr.parent.rightNode) {
            ptr = ptr.parent;
        }

        if (ptr.parent != null && ptr.parent.leftNode == ptr) return ptr.parent;

        return ptr.parent;
    }

    height(): number {
        let lHeight = 0;
        let rHeight = 0;
        if (this.leftNode != null) lHeight = this.leftNode.height();
        if (this.rightNode != null) rHeight = this.rightNode.height();

        return Math.max(lHeight, rHeight) + 1;
    }

    rotateRight(): TreeNode | null {
        if (this.leftNode == null) return null;

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

        if (parent == null)
            return leftRoot;

        return null;
    }

    rotateLeft(): TreeNode | null {
        if (this.rightNode == null) return null;

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

        if (parent == null)
            return rightRoot;

        return null;
    }

    balanceFactor(): number  {
        let lHeight = 0;
        let rHeight = 0;
        if (this.leftNode != null) lHeight = this.leftNode.height();
        if (this.rightNode != null) rHeight = this.rightNode.height();

        return lHeight - rHeight;
    }

    balance() {
        if (this.leftNode != null) this.leftNode.balance();

        if (this.rightNode != null) this.rightNode.balance();

        let bf = this.balanceFactor();

        if (bf > 1) {
            if (this.leftNode != null && this.leftNode.balanceFactor() <= 0) {  // Small right
                this.rotateRight();
            } else {   // Big right
                if (this.leftNode != null) {
                    this.leftNode.rotateLeft();
                    this.rotateRight();
                }
            }
        } else if (bf < -1) {
            if (this.rightNode != null && this.rightNode.balanceFactor() >= 0) {  // Small left
                this.rotateLeft();
            } else {  // Big left
                if (this.rightNode != null) {
                    this.rightNode.rotateRight();
                    this.rotateLeft();
                }
            }
        }
    }
}

export class BinarySearchTree {
    public root: TreeNode | null;

    constructor(root: TreeNode | null = null) {
        this.root = root;
    }

    addValue(value: number, balance: boolean = false): TreeNode {
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
                    let ret = pointer.addLeftNode(value);

                    if (this.root != null && balance) {
                        this.root.balance();

                        let ptr = this.root;
                        while (ptr.parent != null) ptr = ptr.parent;

                        this.root = ptr;
                    }

                    return ret;
                }
            } else {
                if (pointer.rightNode != null) {
                    pointer = pointer.rightNode;
                } else {
                    let ret = pointer.addRightNode(value);
                    if (this.root != null && balance) {
                        this.root.balance();

                        let ptr = this.root;
                        while (ptr.parent != null) ptr = ptr.parent;

                        this.root = ptr;
                    }

                    return ret;
                }
            }
        }
    }

    removeValue(value: number, balance: boolean = true) {
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

        if (this.root != null && balance)
            this.root.balance();
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

    highlightLess(value: number, turn_on: boolean = true) {
        if (this.root == null) return;

        let ptr: TreeNode | null = this.root.first();

        if (ptr.value < value) ptr.highlighted = turn_on;

        while ((ptr = ptr.next()) != null) {
            if (ptr.value < value) ptr.highlighted = turn_on;
        }
    }

    generateRandom(n: number) {
        for (let i = 0; i < n; i++) this.addValue(Math.round((Math.random() * 198 - 99) * 100) / 100, true);
    }
}
