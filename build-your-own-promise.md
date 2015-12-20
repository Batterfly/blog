###promise
随着前端技术的发展，promise也越来越流行，在前端开发中常见的 promise主要有：

 * jQuery的`$.defer`
 * angular的`$q`
 * node的第三方模块`q`
 
用的多了，也就想了解一下原理，同时也想重复造个轮子，加深自己的印象。上面提到的三种promise实现方案并不一样，本文主要参考node的`q`模块(https://github.com/kriskowal/q/tree/v1/design)

对应的github地址为：https://github.com/chenkehxx/build-your-own-promise

### q0.js
熟悉`promise`的人都了解，常用的`defer`主要有`resolve`, `reject`, `notify`三种方法，`promise`主要有`then`方法。
下面我们先来构造一个简单的`defer`对象。

	function defer () {
		var tasks = [],
			state = 'pending',
			value,
			reason;
	
		return {
			resolve: function (_value) {
				if (tasks) {
					value = _value;
					tasks.forEach(function (task) {
						task(value);
					})
					tasks = undefined;
					state = 'resolved';
				} else {
					if (state === 'resolved') {
						throw new Error('A promise should been resolved once.');
					} 
				}
			},
			promise: {
				then: function (callback) {
					if (tasks) {
						tasks.push(callback);
					} else {
						callback(value);
					}
				}
			}
		};
	};
	
再来看看相应的测试代码，看我们上面的这些是否OK？

	var deferred = defer(),
		promise  = deferred.promise;

	promise.then(function (value) {
		console.log(value, value === 'zhangsan');
	});
	promise.then(function (value) {
		console.log(value);
	});
	deferred.resolve('zhangsan');
	
现在可以在浏览器中试试了，当然你也可以选择使用 `mocha` 测试工具

	
	describe('q0', function (done) {
		var deferred,
			promise;
	
		beforeEach(function () {
			deferred = Defer();
			promise = deferred.promise;
		})
	
		it('the argument of then should be the value of defer.resolve', function (done) {
			deferred.resolve('zhangsan');
			promise.then(function (value) {
				expect(value).to.eql('zhangsan');
				done();
			});
		})
	
		it('defer should be resolve once', function () {
			deferred.resolve('zhangsan');
			expect((function () {
				deferred.resolve('lisi');
			})).to.throw('A promise should been resolved once.');
		})
	
	})
	
### q1.js
 `q0.js`实现了一个简单的`promise`，但与我们常用的promise并不一致，我们常用的`promise`是会返回一个promise让我们继续调用`then`，就如同`promise.then().then()`; 那我们接下来就来实现这一步，要实现这一步就必须满足以下这些条件：
 
 * `then`方法返回的必须是一个`promise`
 * 返回的这个`promise`的`resolve值`必须是上一个`promise.then`返回的值。
 	
 		promise.then(function(value){
 			return value1
 		}).then(function(value1));
 * `then`函数返回的可以是一个`value`或一个`promise`。比如上一段代码返回的就是一个`value`。只不过是我们将其转成了一个`promise`。
 
如何将一个`value`转为`promise`。我们先来构建一个`ref`函数
 
 	var ref = function (value) {
		return {
			then: function (callback) {
				return callback(value);
			}
		}
	}

这种方式很好理解，就是将原本的`callback(value)`方式转换成`ref(value).then(callback)`;

但是当我们在`ref`函数中传入`promise`就不应当将其转换了，因此在`ref`函数中加入一个判断:

	var ref = function (value) {
		if (value && typeof value.then === 'function') {
			return value;
		}
		return {
			then: function (callback) {
				return callback(value);
			}
		}
	}

好了，这样就基本实现将`value`转为`promise`的操作，让我们更进一步实现`ref(value).then().then`这种方式的调用，很简单。将`return callback(value)`变成`return ref(callback(value))`;

我们来试试`ref`函数是否可以顺利运行：
 
 	ref('zhangsan').then(function (value) {
		console.log(value);
		return 'lisi';
	}).then(function (value) {
		console.log(value);
	})

接下来需要将`defer`函数中修改一下：
	
	<!--首先是resolve函数-->
		value = _value;
		tasks.forEach(function (task) {
			task(value);
		})
	变为：
		value = ref(_value);
		tasks.forEach(function (task) {
			// task(value);
			value.then(task);
		})
	
	<!--then函数-->
		if (tasks) {
			tasks.push(callback);
		} else {
			callback(value);
		}
	变为：
		var deferred = defer();
		var callback = function (value) {
			deferred.resolve(_callback(value));
		};
		if (tasks) {
			tasks.push(callback);
		} else {
			value.then(callback);
		}
		return deferred.promise;


我们在看看对应的测试代码：

	promise.then(function (value) {
		console.log(value);
		return 'lisi';
	}).then(function (value) {
		console.log(value);
	});
	setTimeout(function () {
		deferred.resolve('zhangsan');
	}, 3000)

相应的mocha测试代码：

	it('the promise return a promise', function (done) {
		deferred.resolve('zhangsan');
		promise.then(function (value) {
			expect(value).to.eql('zhangsan');
			return 'lisi';
		}).then(function (value) {
			expect(value).to.eql('lisi');
			done();
		})
	})
完整q1.js代码具体在这里：

### q2.js

`defer`不仅有`resolve`, 同时还有`reject`, `notify`等方法，`promise.then`也有相应的三个参数。接下来我们来实现`reject`。

首先构造一个函数`reject`:

	var reject = function (reason) {
	    return {
	        then: function (callback, errback) {
	            return ref(errback(reason));
	        }
	    };
	};

然后对应的`then`函数修改成如下：
	
	var deferred = defer();
	var callback = function (value) {
		deferred.resolve(_callback(value));
	};
	var errback = function (reason) {
		deferred.resolve(_errback(reason));
	}
	if (tasks) {
		tasks.push([callback, errback]);
	} else {
		// value.then(callback, errback);
		if (state === 'reject') {
			value.then(errback);
		} else if (state === 'resolved') {
			value.then(callback);
		}
	}
新增`reject`方法：
	
	reject: function (reason) {
		if (tasks) {
			value = ref(reason);
			tasks.forEach(function (task) {
				value.then.apply(value, [task[1], task[0]]);
			})
			tasks = undefined;
			state = 'rejected';
		} else {
			if (state === 'rejected') {
				throw new Error('A promise should been rejected once.');
			} 
		}
	},
修改`resolve`方法：

	tasks.forEach(function (task) {
		// task(value);
		value.then.apply(value, task);
	})

下面来测一测`reject`方法是否ok

	var deferred = defer(),
		promise  = deferred.promise;

	setTimeout(function () {
		deferred.reject('lisi');
	}, 2000);
	
	promise.then(function () {}, function (value) {
		console.log(value);
		return 'zhangsan';
	}).then(function (value) {
		console.log(value);
	})
对应的mocha测试代码：

	it('reject should work', function (done) {
		setTimeout(function () {
			deferred.reject('zhangsan');
		}, 100);

		promise.then(function () {}, function (value) {
			expect(value).to.eql('zhangsan');
			done();
		})
	})
### q3.js
接下来进行一些优化，`promise.then`一般来说都不会将三个参数函数都写出来，因此我们需要进行一下处理：
	
	<!--then函数-->
	// 确保then参数不为空
	_callback = _callback || function (value) {
		return value;
	}
	_errback = _errback || function (reason) {
		return reject(reason);
	}
	
大家都知道`promise`是对未来执行的一种承诺，因此它的执行动作应该是未来的某一个时刻。而我们目前的代码都是在同一个执行周期里面执行，因此我们需要做一下处理。创建一个`nextTick`函数，将这些执行操作，放在`nextTick`中执行。

	<!--nextTick-->
	// 不一定要是使用setTimeout，可以选择使用process.nextTick
	or setImmediate
		var nextTick = function (callback) {
			setTimeout(callback, 0);
		};
	
因此将所有的callback执行放在`nextTick`中执行。此处改动较多，

	<!--相关注释部分，就是改动地方-->
	'use strict';

	var ref = function (value) {
		if (value && typeof value.then === 'function') {
			return value;
		}
		return {
			then: function (callback) {
				// return ref(callback(value));
				var deferred = defer();
				nextTick(function () {
					deferred.resolve(callback(value))
				});
				return deferred.promise;
			}
		}
	}
	
	var reject = function (reason) {
		return {
			then: function (callback, errback) {
				// return ref(errback(reason));
				var deferred = defer();
				nextTick(function () {
					deferred.resolve(errback(reason))
				});
				return deferred.promise;
			}
		}
	};
	
	// 不一定要是使用setTimeout，可以选择使用process.nextTick
	// or setImmediate
	var nextTick = function (callback) {
		setTimeout(callback, 0);
	};
	
	function defer () {
		var tasks = [],
			state = 'pending',
			value,
			reason;
	
		return {
			resolve: function (_value) {
				if (tasks) {
					value = ref(_value);
					tasks.forEach(function (task) {
						// value.then.apply(value, task);
						nextTick(function () {
							value.then.apply(value, task);
						})
					})
					tasks = undefined;
					state = 'resolved';
				} else {
					if (state === 'resolved') {
						throw new Error('A promise should been resolved once.');
					} 
				}
			},
			reject: function (reason) {
				if (tasks) {
					value = ref(reason);
					tasks.forEach(function (task) {
						// value.then.apply(value, [task[1], task[0]]);
						nextTick(function () {
							value.then.apply(value, [task[1], task[0]]);
						})
					})
					tasks = undefined;
					state = 'rejected';
				} else {
					if (state === 'rejected') {
						throw new Error('A promise should been rejected once.');
					} 
				}
			},
	
			promise: {
				then: function (_callback, _errback) {
					var deferred = defer();
					_callback = _callback || function (value) {
						return value;
					}
					_errback = _errback || function (reason) {
						return reject(reason);
					}
					var callback = function (value) {
						deferred.resolve(_callback(value));
					};
					var errback = function (reason) {
						deferred.resolve(_errback(reason));
					}
					if (tasks) {
						tasks.push([callback, errback]);
					} else {
						/*if (state === 'reject') {
							value.then(errback);
						} else if (state === 'resolved') {
							value.then(callback);
						}*/
						nextTick(function (){
							if (state === 'rejected') {
								value.then(errback);
							} else if (state === 'resolved') {
								value.then(callback);
							}
						})
					}
					return deferred.promise;
				}
			}
		};
	}
		
	module.exports = defer;

### q4.js
接下来我们来实现`defer.notify`。在`defer`中定义一个变量`progresses`用来保存相关的进度。在defer中定义一个方法：`notify`:

	noitfy: function (progress) {
		if (state === 'resolved' || state === 'rejected') {
			return ;
		}
		progresses.push(progress);
	},
那何时进行notify呢，当然是在`resolve`和`reject`之前执行，也就是在执行`then`方法的时候：

	<!--then中新增-->	
	then: function (_callback, _errback, _notifyback) {
		var deferred = defer();
		_callback = _callback || function (value) {
			return value;
		}
		_errback = _errback || function (reason) {
			return reject(reason);
		}
		_notifyback  = _notifyback || function (progress) {
			return progress;
		}
		var callback = function (value) {
			deferred.resolve(_callback(value));
		};
		var errback = function (reason) {
			deferred.resolve(_errback(reason));
		}

		nextTick(function () {
			while(progresses.length) {
				_notifyback(progresses.shift());
			}
		});

		if (tasks) {
			tasks.push([callback, errback]);
		} else {
			nextTick(function (){
				if (state === 'rejected') {
					value.then(errback);
				} else if (state === 'resolved') {
					value.then(callback);
				}
			})
		}
		return deferred.promise;
	}

那我们来测一测`notify`:

	var deferred = defer(),
	promise  = deferred.promise;

	for (var i = 0; i < 10; i++) {
		deferred.noitfy(i);
	}
	setTimeout(function () {
		deferred.reject('lisi');
	}, 2000);
	
	promise.then(function () {}, function (value) {
		console.log(value);
		return 'zhangsan';
	}, function (progress) {
		console.log(progress);
	}).then(function (value) {
		console.log(value);
	})

相关的mocha测试代码：

	it('notify should work', function (done) {
		var spy = chai.spy(function (progress) {
			console.log(progress);
		});
		setTimeout(function () {
			deferred.reject('zhangsan');
		}, 100);
		for (var i = 0; i < 10; i++) {
			deferred.noitfy(i);
		}
	
		promise.then(function () {}, function (value) {
			expect(value).to.eql('zhangsan');
			expect(spy).to.have.been.called.exactly(10);
			done();
		}, spy)
	})

### q5.js
到上面为止，我们基本实现了一个完成的promise。这个promise已经可以使用，但是如果在执行回调的过程中出现`error`我们应当如何处理？很简单我们在下一级的promise中进行处理。

	<!--在then函数中，如果发生错误，则进行deferred.reject-->
	var callback = function (value) {
		// deferred.resolve(_callback(value));
		var result;
		try {
			result = _callback(value)
		} catch (e) {
			deferred.reject(e);
		} finally {
			deferred.resolve(result);
		}
	};
	var errback = function (reason) {
		// deferred.resolve(_errback(reason));
		var result;
		try {
			result = _errback(reason)
		} catch (e) {
			deferred.reject(e);
		} finally {
			deferred.resolve(result);
		}
	}

	nextTick(function () {
		while(progresses.length) {
			// _notifyback(progresses.shift());
			try {
				_notifyback(progresses.shift());
			} catch (e) {
				deferred.reject(e);
				break;
			}
		}
	});

相应的测试js代码：

	var deferred = defer(),
	promise  = deferred.promise;

	setTimeout(function () {
		deferred.resolve('lisi');
	}, 2000);
	
	promise.then(function(value) {
		console.log(value);
		throw 'zhangsan';
	}).then(function () {}, function (err) {
		console.error(err);
		done();
	})
	
mocha测试代码：

	it('catch error in reject should work', function (done) {
		setTimeout(function () {
			deferred.resolve('lisi');
		}, 10);
		promise.then(function(value) {
			expect(value).to.eql('lisi');
			throw 'zhangsan';
		}).then(function () {}, function (err) {
			expect(err).to.eql('zhangsan');
			done();
		})
	})

### q6.js
到目前为止，这个promise基本上是可以使用了，它的基本功能都是OK的。一个好的框架，当让不仅仅是只有这些基本功能。接下来我们为他们添加一些常用功能如：`all` `done` `fail` `finally` `catch`等这些常用方法。

	<!--all-->
	function all (arr) {
		if (Object.prototype.toString.call(arr, arr) === '[object Array]') {
			var len     = arr.length;
			var already = 0;
			var deferred = defer();
	
			// 确保所有promise已经完成
			arr.forEach(function (promise) {
				promise.then(function () {
					console.log('first promise: ', already);
					already++;
					if (already === len) {
						deferred.resolve()
					}
				})
			});
	
			var result = [];
			var resultDeferred = defer();
			// 按序获取所有promise的值
			deferred.promise.then(function () {
	
				arr.forEach(function (promise) {
					promise.then(function (value) {
						result.push(value);
					})
				})
	            resultDeferred.resolve(result);
			});
			return resultDeferred.promise;
		} else {
			var deferred = defer();
			deferred.resole(arr);
			return deferred.promise;
		}
	}

完整的q6.js

	'use strict';

	function Q () {}
	Q.defer = defer;
	Q.all   = all;
	Q.any   = any;
	
	var ref = function (value) {
		if (value && typeof value.then === 'function') {
			return value;
		}
		return {
			then: function (callback) {
				// return ref(callback(value));
				var deferred = defer();
				nextTick(function () {
					deferred.resolve(callback(value))
				});
				return deferred.promise;
			}
		}
	}
	
	var reject = function (reason) {
		return {
			then: function (callback, errback) {
				// return ref(errback(reason));
				var deferred = defer();
				nextTick(function () {
					deferred.resolve(errback(reason))
				});
				return deferred.promise;
			}
		}
	};
	
	// 不一定要是使用setTimeout，可以选择使用process.nextTick
	// or setImmediate
	var nextTick = function (callback) {
		setTimeout(callback, 0);
	};
	
	var noopFn = function () {};
	
	function defer () {
		var tasks      = [],
			progresses = [],
			state      = 'pending',
			value,
			reason,
			_finallyback;
	
		return {
			resolve: function (_value) {
				if (tasks) {
					value = ref(_value);
					tasks.forEach(function (task) {
						// value.then.apply(value, task);
						nextTick(function () {
							value.then.apply(value, task);
						})
					})
					tasks = undefined;
					state = 'resolved';
				} else {
					if (state === 'resolved') {
						throw new Error('A promise should been resolved once.');
					} 
				}
	
				if (_finallyback) {
					nextTick(function () {
						_finallyback && (_finallyback());
						_finallyback = undefined;
					})
				}
	
			},
			reject: function (reason) {
				if (tasks) {
					value = ref(reason);
					tasks.forEach(function (task) {
						// value.then.apply(value, [task[1], task[0]]);
						nextTick(function () {
							value.then.apply(value, [task[1], task[0]]);
						})
					})
	
					tasks = undefined;
					state = 'rejected';
				} else {
					if (state === 'rejected') {
						throw new Error('A promise should been rejected once.');
					} 
				}
	
				if (_finallyback) {
					nextTick(function () {
						_finallyback && (_finallyback());
						_finallyback = undefined;
					})
				}
			},
			noitfy: function (progress) {
				if (state === 'resolved' || state === 'rejected') {
					return ;
				}
				progresses.push(progress);
			},
			promise: {
				then: function (_callback, _errback, _notifyback) {
					var self = this;
					var deferred = defer();
					_callback = _callback || function (value) {
						return value;
					}
					_errback = _errback || function (reason) {
						return reject(reason);
					}
					_notifyback  = _notifyback || function (progress) {
						return progress;
					}
					var callback = function (value) {
						// deferred.resolve(_callback(value));
						var result;
						try {
							result = _callback(value)
						} catch (e) {
							deferred.reject(e);
						} finally {
							deferred.resolve(result);
						}
					};
					var errback = function (reason) {
						// deferred.resolve(_errback(reason));
						var result;
						try {
							result = _errback(reason)
						} catch (e) {
							deferred.reject(e);
						} finally {
							deferred.resolve(result);
						}
					}
	
					nextTick(function () {
						while(progresses.length) {
							// _notifyback(progresses.shift());
							try {
								_notifyback(progresses.shift());
							} catch (e) {
								if (_catchback) {
									_catchback(e);
									catchback = undefined;
									return;
								}
								deferred.reject(e);
								break;
							}
						}
					});
	
					if (tasks) {
						tasks.push([callback, errback]);
					} else {
						nextTick(function (){
							if (state === 'rejected') {
								value.then(errback);
							} else if (state === 'resolved') {
								value.then(callback);
							}
						})
					}
	
					if (_finallyback) {
						nextTick(function () {
							_finallyback && (_finallyback());
							_finallyback = undefined;
						})
					}
					return deferred.promise;
				},
				done: function (_callback) {
					return  this.then(_callback, noopFn);
				},
				fail: function (_errback) {
					return this.then(noopFn, _errback);
				},
				'finally': function (finallyback) {
					_finallyback = finallyback;		
				},
				'catch': function (catchback) {
					// _catchback = catchback;
					return this.then(noopFn, catchback);
				}
	
			}
		};
	}
	
	function all (arr) {
		if (Object.prototype.toString.call(arr, arr) === '[object Array]') {
			var len     = arr.length;
			var already = 0;
			var deferred = defer();
	
			// 确保所有promise已经完成
			arr.forEach(function (item) {
				ref(item).then(function () {
					already++;
					if (already === len) {
						deferred.resolve()
					}
				})
			});
	
			var result = [];
			var resultDeferred = defer();
			// 按序获取所有promise的值
			deferred.promise.then(function () {
	
				arr.forEach(function (item) {
					ref(item).then(function (value) {
						result.push(value);
					})
				})
	            resultDeferred.resolve(result);
			});
			return resultDeferred.promise;
		} else {
			var deferred = defer();
			deferred.resole(arr);
			return deferred.promise;
		}
	}
	
	function any (arr) {
		var deferred = defer();
		arr.forEach(function (item) {
			ref(item).then(function (value) {
				deferred.resolve(value);
			})
		})
		return deferred.promise();
	}
	
	module.exports = Q;

mocha的相关测试代码：
	
	it('promise done should work', function (done) {
		setTimeout(function () {
			deferred.resolve('lisi');
		}, 10);
		promise.done(function (value) {
			expect(value).to.eql('lisi');
			done();
		})
	})

	it('promise fail should work', function (done) {
		setTimeout(function () {
			deferred.reject('lisi');
		}, 10);
		promise.fail(function (value) {
			expect(value).to.eql('lisi');
			done();
		})
	})

	it('catch error in fail method', function (done) {
		setTimeout(function () {
			deferred.resolve('lisi');
		}, 10);
		promise.done(function (value) {
			expect(value).to.eql('lisi');
			throw 'zhangsan';
		}).fail(function (value) {
			expect(value).to.eql('zhangsan')
			done();
		})
	})

	it('promise finally should work', function (done) {
		var deferred1 = Defer();
		var deferred2 = Defer()
		setTimeout(function () {
			deferred1.resolve('lisi');
			deferred2.reject('lisi');
		}, 10);
		deferred1.promise['finally'](function () {
			done();
		})
		/*deferred2.promise['finally'](function (value) {
			expect(value).to.eql('lisi');
			done()
		})*/
	})

	it('catch error in catch method', function (done) {
		setTimeout(function () {
			deferred.resolve('lisi');
		}, 10);
		promise.done(function (value) {
			expect(value).to.eql('lisi');
			throw 'zhangsan';
		})['catch'](function (err) {
			expect(err).to.eql('zhangsan')
			done();
		})
	})

	it('Q.all method should work', function (done) {
		var d,
			arr = [];
		for (var i = 0; i < 10; i++) {
			d = Defer();
			d.resolve(i)
			arr.push(d.promise);
		}
		d = Defer();
		arr.push(d.promise);
		setTimeout(function () {
			d.resolve('end');
		}, 100);

		Q.all(arr).then(function (value) {
			expect(value.length).to.eql(11);
			done();
		})
	})