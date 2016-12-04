var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	youtubeID: {type: String, required: true, initial: true},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

//build post url
Post.schema.virtual('href').get(function() {
	return '/post/' + this.slug;
});

//build video thumbnail url from youtubeID
Post.schema.virtual('imageURL').get(function() {
	return 'https://img.youtube.com/vi/' + this.youtubeID + '/hqdefault.jpg';
});

//build youtube embed code
Post.schema.virtual('youtubeEmbed').get(function() {
	var youtubeURL = 'https://www.youtube.com/embed/' + this.youtubeID;
	return	'<iframe width="850" height="480" src="' + youtubeURL + '" frameborder="0" allowfullscreen></iframe>';
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
