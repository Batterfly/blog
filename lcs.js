var LCS_Length = function (strA, strB) {
	var lenA = strA.length;
	var lenB = strB.length;

	var arrA = new Array(lenA + 2);
	var arrB = new Array(lenB + 2);
	res = arrA.join('0').split('').map(function (item, index) {
		return arrB.join('0').split('');
	})
	for (var i = 0; i <= lenA; i++) {
		for (var j = 0; j <= lenB; j++) {
			res[i][j] = 0;
		} 
	}
	
	for (var i = 1; i < lenA + 1; i++) {
		for (var j = 1; j < lenB + 1; j++) {
			if (strA[i-1] == strB[j-1]) {
				res[i][j] = 1 + res[i-1][j-1];
			} else if (res[i-1][j] > res[i][j-1]) {
				res[i][j] = res[i-1][j];
			} else {
				res[i][j] = res[i][j-1];
			}
		}
	}

	console.log(res);
	return res;
}

var LCS_parse = function (arr, str, i, j) {
	if (i == 0 || j == 0) {
		return ;
	}
	if (res[i][j] == res[i-1][j-1] + 1) {
		LCS_parse(arr, str, i - 1, j -1);
		console.log(str[i-1]);
	} else if (res[i][j] == res[i-1][j]) {
		LCS_parse(arr, str, i - 1, j);
	} else {
		LCS_parse(arr, str, i, j - 1);
	}
}

var LCS = function (strA, strB) {
	var arr = LCS_Length(strA, strB);
	LCS_parse(arr, strA, strA.length, strB.length);
}

LCS('ABCBDAB', 'BDCABA');





