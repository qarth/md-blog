(function () {

  var blogSub = Meteor.subscribe('blog');

  function getBaseBlogPath () {
    return Meteor.settings.public.blog.blogPath;
  }

  function getBaseArchivePath () {
    return Meteor.settings.public.blog.archivePath;
  }

  function getBlogPostPath () {

    if (Meteor.settings.public.blog.useUniqueBlogPostsPath) {
      return getBaseBlogPath() + '/:shortId/:slug';
    }

    return baseBlogPath + '/:slug';
  }

  Router.map(function () {
    this.route('blogList', {
      path: getBaseBlogPath(),
      layoutTemplate: 'blogListLayout',
      action: function () {
        this.wait(blogSub);
        this.render('blogList');
      },
      data: function () {
        var sort = Meteor.settings.public.blog.sortBy;
        return Blog.find({archived: false}, {sort: sort ? sort : {date: -1}});
      }
    });

    this.route('blogListArchive', {
      path: getBaseArchivePath(),
      layoutTemplate: 'blogListLayout',
      action: function () {
        this.wait(blogSub);
        this.render('blogList');
      },
      data: function () {
        var sort = Meteor.settings.public.blog.sortBy;
        return Blog.find({archived: true}, {sort: sort ? sort : {date: -1}});
      }
    });

    this.route('blogPost', {
      path: getBlogPostPath(),
      layoutTemplate: 'blogPostLayout',
      action: function () {
        this.wait(blogSub);
        this.render('blogPost');
      },
      data: function () {
        if (this.ready()) {
          var blog = Blog.findOne({slug: this.params.slug});
          if (blog) {
            blog.loaded = true;
            return blog;
          }
          this.render('not-found')
        }
      }
    });

  });
})();