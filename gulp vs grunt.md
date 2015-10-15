### grunt vs gulp vs npm

随着前端技术的流行，前端已经不仅仅局限于之前的页面展示了，更多的是单页面应用(SAP, singal application page)的运用，随着AMD、CMD的流行，前端也逐渐朝工程化和模块化的趋势发展。前端代码越来越复杂，同时也产生了越来越多的构建工具，而其中最常用的就是`gulp`，`grunt`，`npm`。

#### npm

在大部分人心中`npm`是包管理工具，怎么又成了构建工具，其实`npm`是可以当成构建工具来使用的。奥秘就是`package.json`中的`scripts`属性。

很多人在github项目中见到 `npm test`或`npm start`这种指令，这其实就是使用`package.json`中的`scripts`定义自己项目的一些指令。如果感兴趣可以查看具体的相关文档[package.json script](https://docs.npmjs.com/misc/scripts)

	  "main": "index.js",
	  "bin": "index.js",
	  "scripts": {
	    "start": "npm install -g bower && bower install && npm install",
	    "build": "node index.js && gulp build",
	    "test": "mocha && karma start test/karma.conf.js"
	  },

但是这种方式依然还是比较麻烦的因为`npm`脚本指定执行的js文件可能需要你自己写一遍。目前社区还没有针对`npm`方式的构建工具提供较多插件。但是`npm`有一点是`grunt`和`gulp`不能提供的，`npm`方式可以使用`bash`命令，如果你精通`bash`操作，建议你不妨试试。

#### grunt vs gulp 配置

[grunt](http://gruntjs.com/getting-started)和[gulp](http://gulpjs.com/)是比较常用的构建工具了。其中`grunt`是老牌的构建工具，社区成熟，插件多，几乎所有的插件你都可以在这里找到。但是也有一个问题，就是配置项比较麻烦, 下面是来自官网的一份`Gruntfile.js`文件, 这是一份压缩混淆的构建脚本。

	module.exports = function(grunt) {
	
	  // Project configuration.
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	      options: {
	        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	      },
	      build: {
	        src: 'src/<%= pkg.name %>.js',
	        dest: 'build/<%= pkg.name %>.min.js'
	      }
	    }
	  });
	
	  // Load the plugin that provides the "uglify" task.
	  grunt.loadNpmTasks('grunt-contrib-uglify');
	
	  // Default task(s).
	  grunt.registerTask('default', ['uglify']);
	};

在来看看对应的相应的gulp压缩混淆脚本

	var gulp = require('gulp');
	var uglify = require('gulp-uglify');
	
	gulp.task('uglify', function({
		gulp.src('/src/*.js')
			.pipe(uglify())
			.pipe(gulp.dest('build'));
	}))

假如任务内的操作比较多，`grunt`的配置文件就会非常多，而`gulp`就相对简洁。

#### grunt vs gulp 性能

一般来说`gulp`的性能要高于`grunt`。`grunt`是基于文件式处理，会频繁调用IO，这意味着大多数`grunt`的任务将从磁盘中读取，再写入到磁盘。如果你的多个任务需要操作同一个文件，那么该文件很有可能被从磁盘中多次读取。而且`grunt`不支持模块的重用，子任务间可能会出现重复性工作。

`gulp`是基于`node的stream`流式处理。这意味着，Gulp没有Grunt那种磁盘密集型I/O操作的问题。这也是它比Grunp更快的原因，更少的时间花在I/O上面。每个插件只负责自己的功能，每个任务通过多个插件共同合作来实现。
 
 从上面的`gulp uglify`代码来看，可以发现每个任务从src读取源文件生成流开始，中间通过pipe传递流，所有的任务步骤都是在流上做一些操作，最后将流通过dest输出到目标上。
 
#### grunt vs gulp 差异
在github上可以看到有很多项目是用`grunt`来进行构建的。如常用`jquery`，可以在github上看到它的的[Gruntfile.js](https://github.com/jquery/jquery/blob/master/Gruntfile.js)中冗余的配置型。这些冗余的配置项并不容易维护，主要体现在以下几个方面：

 * 配置和运行分离，所有的配置都是放在`Gruntfile.js`对外抛出的export
 * 插件功能不单一，可能多个插件实现了同一个功能
 * 配置项过多，做的事情越多，维护麻烦
 * 任务执行中会产生一些临时文件，较频繁的IO操作导致性能滞后
 
`gulp`作为`grunt`竞争对手，是如何解决的：

 * `gulp`遵循`code over configuration`的原则，直接就在调用的地方配置
 * `gulp`的插件严格遵循单一职责原则，一个插件仅作一件事，多个插件合作完成任务
 * `gulp`基于`node stream`思想，避免频繁的IO操作。
 
### others

 随着社区的发展，`gulp`的插件已经越来越多了，很多插件都同时支持`grunt`和`gulp`。未来`gulp`是主流，建议初学者可以从`gulp`开始学习。
 
 给大家推荐几个构建工具中常用的框架
 
 * `browserify` 目前`npmjs`上最受关注的框架，让你写前端代码就像写`nodejs`代码一样，同时还拥有丰富的中间件，帮你实现各种功能。
 * `browser-sync` 相当于大家常用的`liveload`，不过相对于`liveload`更加强大，如`css注入`等功能
 * `webpack`，`browserify`的对手，写`react`的应该知道这个的。
 
#### 推荐
 大家可能维护多个项目，可能每个项目的构建工具都很相似，都是实现合并压缩等功能。
 
 如果大家的项目只是实现这些功能，可以给大家推荐`npm`上的一个工具`browserify-build`。全局安装`npm browserify-build`. 然后在每个项目下通过`browserify-build config`创建配置文件或者是`browseify-build clone`来创建来clone已经配置好的`gulpfile.js`文件然后自行修改。
 
 	* browserify-build config 
 	   创建build.conf.json配置文件
 	   
 	* brosserify-build init
 	   创建可用的一个demo
 	   
 	* browserify-build clone
 		clone相应的gulp task，以便自行修改
 	
 	* browserify-build start
 		类似执行gulp dev
 	
 	* browserify-build build
 	    构建，类似执行gulp build
