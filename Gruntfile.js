var lrSnippet= require('connect-livereload')({ port:4000});
var mountFolder =function(connect,dir){
    return connect.static(require('path').resolve(dir));
};
var deltaConf={
    app:'app',
    dist:'dist'
};

module.exports = function(grunt){

    grunt.initConfig({
        
        delta:deltaConf,

        watch:{
            jekyll:{
                files:['<%= delta.app %>/**/*.{html,md,mkd,markdown,yml}','_config.yml','!<%= delta.app %>/_bower_components'],
                tasks:['jekyll:server']
            },
            livereload:{
                options:{
                    livereload:4000
                },
                files:[
                '.jekyll/**/*.html',
                '{.tmp,<%= delta.app %>}/css/**/*.css',
                '{.tmp,<%= delta.app %>}/<%= js %>/**/*.js',
                '<%= delta.app %>/images/**/*.{gif,jpg,jpeg,png,svg,webp}'
                ]
            }    
        },
        connect:{
            options:{
                port:9000,
                hostname:'localhost'
            },
            open:{
                server:{
                    path:'http://localhost:<%= connect.options.port %>'
                }
            },
            livereload: {
                options: {
                  middleware: function (connect) {
                    return [
                    lrSnippet,
                    mountFolder(connect, '.tmp'),
                    mountFolder(connect, '.jekyll'),
                    mountFolder(connect, deltaConf.app)
                    ];
                  }
                }
            },
            test:{
                options:{
                    middleware:function(connect){
                        return [
                        mountFolder(connect,'.tmp'),
                        mountFolder(connect,'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                  middleware: function (connect) {
                    return [
                    mountFolder(connect, deltaConf.dist)
                    ];
                    }   
                }
            }
        },
        clean:{
              dist:{
                files:[{
                    dot:true, 
                    src:[
                       'tmp',
                        '<%= delta.dist %>/*',
                        '!<%= delta.dist %>/.git*'
                        ]
                    }]
                },
                server:['.tmp','.jekyll']
        },
            jekyll: {
              options: {
                bundleExec: true,
                src : '<%= delta.app %>'
              },
              dist: {
                options: {
                  dest: '<%= delta.dist %>',
                  config: '_config.yml,_config.build.yml'
                }
              },
              server: {
                options: {
                  dest: '.jekyll',
                  config: '_config.yml'
                }
              }
        },
        csscss: {
              options: {
                bundleExec: true,
                minMatch: 2,
                showParserErrors: true,
                colorize: true,
                shorthand: false,
                verbose: true
              },
              report: {
               src: ['<%= delta.app %>/css/**/*.css']
             }
        },
        copy:{
            dist:{
                files:[{
                    expand :true,
                    dot:true,
                    cwd:'<%= delta.app %>',
                    src: ['images/**/*','fonts/**/*'],
                    dest: '<%= delta.dist %>'
                }]
            }
        },
        rev:{
            options:{
                length: 4
            },
            dist:{
                files:{
                    src:[
                    '<%= delta.dist %>/js/**/*.js',
                    '<%= delta.dist %>/css/ **/*.css',
                    '<%= delta.dist %>/images/**/*.{gif,jpg,jpeg,png}',
                    '<%= delta.dist %>/fonts/**/*.{svg,ttf,woff}'
                    ]
                }
            }
        },
        concurrent:{
            server:[
                'jekyll:server'
            ],
            dist:[
            'copy:dist'
            ]
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('server', function(target){
        if(target=== 'dist'){
            return grunt.task.run(['build','open']);
        }
        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'connect:livereload',
            'open',
            'watch'
            ]);
    });    

    grunt.registerTask('build',[
        'jekyll:dist',
        'concurrent:dist',
        'clean:dist',
        'rev'
    ]);

    grunt.registerTask('default',[
        'build']);
};