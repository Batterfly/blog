/* Node
 * ---- options ---
 * color: red black
 * parent
 * key
 * left
 * right
*/

var leftRotate  = function (Tree, node) {
	// y 为node的右节点
	var y = node.right;
	// y的左节点成为node的右节点
	node.right = y.left;

	if (y.left !== null) {
		y.left.parent = node;
	}
	// y代替node的位置
	y.parent = node.parent;

	// 若node为根接头点
	if (node.parent === null) {
		Tree.root = y;
	} else if (node == node.parent.left) {	// node 为左节点
		node.parent.left = y;
	} else {
		node.parent.right = y;
	}
	// node 成为y的左节点
	y.left = node;
	// y成为node的父节点 
	node.parent = y;
}

var RBTreeInsert = function (Tree, z) {
	// y始终指向x的父节点
	var y = null;
	// x指向当前树的根节点
	var x = Tree.root;

	while (x !== null) {
		y = x;
		if (z.key < x.key) {
			x = x.left;
		} else {
			x = x.right;
		}
		// 为了找到合适的插入点，x探路跟踪路径，直到x成为null
	}
	// y 置为插入节点z的父节点
	z.parent = y;

	// 若y为空，则证明tree为空
	if (y === null) {	
		Tree.root = z;
	} else if (z.key < y.key) {
		y.left = z;
	} else {
		y.right = z;
	}
	z.left = null;
	z.right = null;
	z.color = 'red';

	RBTreeInsertFixUp(Tree, z);
}

var RBTreeInsertFixUp = function (Tree, z) {
	// 插入节点的父节点为red
	while(z.parent.color === 'red') {
		// 父节点为左节点
		if (z.parent = z.parent.parent.left) {
			// 叔叔节点
			var y = z.parent.parent.right;
			// case 1
			if (y.color === 'red') {	
				z.parent.color = 'black';
				y.color = 'black';
				z.parent.parent.color = 'red';
				z = z.parent.parent;
				continue;
			} else if (z = z.parent.right) {	// 当前点为右节点
				// case 2
				z = z.parent;
				leftRotate(Tree, z);
				continue;
				
			} else {
				// case 3
				z.parent.color = 'black';
				z.parent.parent.color = 'red';
				rightRotate(Tree, z.parent.parent);
				continue;
			}
		} else {
			var y = z.parent.parent.left;
			if (y.color === 'red') {
				// case 1
				z.parent.color = 'black';
				y.color = 'black';
				z.parent.parent.color = 'red';
				continue;
			} else if (z === z.parent.right) {
				// case 2
				z = z.parent;
				leftRotate(Tree, z);
				continue;
			} else {
				// case 3
				z.parent.color = 'back';
				z.parent.parent.color = 'red';
				rightRotate(Tree, z.parent.parent)
			}
		}
	}
	Tree.root.color = "black";
}

var RBTreeDelete = function (Tree, z) {
	var x, y;
	if (z.left === null || z.right === null) {
		y = z;
	} else {
		// case 3
		y = TreeSuccessor(z);
	}

	if (y.left !== null) {
		x = y.left;
	} else {
		x = y.right;
	}
	// case 2
	x.parent = y.parent;
	// 删除根节点
	if (y.parent === null) {
		Tree.root = x;
	} else if (y === y.parent.left) {
		y.parent.left = x;
	} else {
		y.parent.right = x;
	}

	// case 3
	if ( y !== z) {
		z.key = y.key;
	}
	if (y.color === 'block') {
		RBTreeDeleteFixup(Tree, x);
	}
	return y;
}

var RBTreeDeleteFixup = function (Tree, x) {
	while (x !== Tree.root && x.color === 'black') {
		var w;
		if (x == x.parent.left) {
			w = x.parent.right;

			if (w.color === 'red') {
				// case 1
				x.parent.color = 'red';
				w.color = 'black';
				leftRotate(Tree, x.parent);
				w = x.parent.right;
			}

			if (w.left.color === 'black' && w.right.color === 'black') {
				// case 2
				w.color = 'red';
				x = x.parent;
			} else if (w.right.color === 'black') {
				// case 3
				w.left.color = 'black';
				w.color = 'red';
				rightRotate(Tree, w);

				// case 4
				w.color = x.parent.color;
				x.parent.color = 'black';
				leftRotate(Tree, x.parent):
				leftRotate(Tree, x.parent);
				x = Tree.root;
			}
		} else {
			// do the same as then clause with 'right' and 'left' exchanged
		}
	}
	x.color = 'balck';
}

