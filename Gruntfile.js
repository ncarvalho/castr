module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: 5080,
					base: 'public',
					keepalive: true,
					open: true
				}
			}
		},
		wiredep: {
			tasks: {
				src: 'public/index.html'
			}
		},
		sass: {
    		dist: {
      			files: {
       				'public/css/main.css': 'sass/main.sass'
      			},
      			options: {
      				outputStyle: 'compressed'
      			}
    		}
  		},
		concat: {
		    dist: {
		    	src: [
		    		'controllers/src/init.js', 
		    		'controllers/src/register.js', 
		    		'controllers/src/agenda.js',
		    		'controllers/src/apply.js',
		    		'controllers/src/applicant.js',
		    		'controllers/src/status.js',
		    		'controllers/src/notes.js',
		    		'controllers/src/chat.js',
		    		'controllers/src/projects.js',
		    		'controllers/src/project.js',
		    		'controllers/src/select.js',
		    		'controllers/src/contribs.js',
		    		'controllers/src/contrib.js',
		    		'controllers/src/category.js',
		    		'controllers/src/myprojects.js'
		    	],
		    	dest: 'controllers/app.js',
		    },
		},
  		minified: {
			js: {
				src: 'js/*.js',
				dest: 'public/js/'
			},
			controllers: {
				src: 'controllers/app.js',
				dest: 'public/controllers/'
			}, 
  			options: {
  				sourcemap: false,
			    allinone: false,
			    ext: '.min.js'
  			}
  		},
  		cssmin: {
			target: {
		    	files: [{
		      		expand: true,
		      		cwd: 'css/',
		      		src: ['*.css', '!*.min.css'],
		      		dest: 'public/css/',
		      		ext: '.min.css'
		    	}]
		  	}
		},
		watch: {
			css: {
				files: '**/*.sass',
				tasks: ['sass']
			},
			js: {
				files: "js/**/*.js", 
				tasks: ["concat","minified"],
				options: {
					livereload: true
				}
			},
			controllers: {
				files: "controllers/**/*.js", 
				tasks: ["concat","minified"],
				options: {
					livereload: true
				}
			},
			cssmin: {
				files: "css/*.css",
				tasks: ["cssmin"],
				options: {
					livereload: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-minified');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('server', ['wiredep', 'connect']);
	grunt.registerTask('styles', ['sass', 'concat', 'minified', 'cssmin', 'watch']);
}