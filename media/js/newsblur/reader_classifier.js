NEWSBLUR.ReaderClassifier = function(story_id, feed_id, options) {
    var defaults = {};
    
    this.story_id = story_id;
    this.feed_id = feed_id;
    this.options = $.extend({}, defaults, options);
    this.model = NEWSBLUR.AssetModel.reader();
    this.google_favicon_url = 'http://www.google.com/s2/favicons?domain_url=';
    this.runner();
};

NEWSBLUR.ReaderClassifier.prototype = {
    
    runner: function() {
        this.find_story_and_feed();
        this.make_modal();
        this.handle_text_highlight();
        this.handle_select_checkboxes();
        this.handle_cancel();
        this.open_modal();
    },
    
    find_story_and_feed: function() {
        this.story = this.model.get_story(this.story_id);
        this.feed = this.model.get_feed(this.feed_id);
    },
    
    make_modal: function() {
        var self = this;
        var story = this.story;
        var feed = this.feed;
        
        this.$classifier = $.make('div', { className: 'NB-classifier' }, [
            $.make('h2', 'What do you like about this story?'),
            $.make('form', { method: 'post' }, [
                (story.story_title && $.make('div', { className: 'NB-classifier-field' }, [
                    $.make('h5', 'Story Title'),
                    $.make('input', { type: 'checkbox', name: 'facet', value: 'title', id: 'classifier_title' }),
                    $.make('input', { type: 'text', value: story.story_title, className: 'NB-classifier-title-highlight' }),
                    $.make('label', { 'for': 'classifier_title' }, [
                        $.make('div', [
                            'Look for: ',
                            $.make('span', { className: 'NB-classifier-title NB-classifier-facet-disabled' }, 'Highlight phrases to look for in future stories')
                        ])
                    ])
                ])),
                (story.story_authors && $.make('div', { className: 'NB-classifier-field' }, [
                    $.make('h5', 'Story Author'),
                    $.make('input', { type: 'checkbox', name: 'facet', value: 'author', id: 'classifier_author' }),
                    $.make('label', { 'for': 'classifier_author' }, [
                        $.make('b', story.story_authors)
                    ])
                ])),
                $.make('div', { className: 'NB-classifier-field' }, [
                    $.make('h5', 'The Publisher'),
                    $.make('input', { type: 'checkbox', name: 'facet', value: 'publisher', id: 'classifier_publisher' }),
                    $.make('label', { 'for': 'classifier_publisher' }, [
                        $.make('img', { className: 'feed_favicon', src: this.google_favicon_url + feed.feed_link }),
                        $.make('span', { className: 'feed_title' }, feed.feed_title)
                    ])
                ]),
                $.make('div', { className: 'NB-classifier-submit' }, [
                    $.make('input', { type: 'submit', disabled: 'true', className: 'NB-disabled', value: 'Check what you like above...' }),
                    ' or ',
                    $.make('a', { href: '#', className: 'NB-classifier-cancel' }, 'cancel')
                ])
            ]).bind('submit', function(e) {
                e.preventDefault();
                self.save();
                return false;
            })
        ]);
    },
    
    open_modal: function() {
        this.$classifier.modal({
            'minWidth': 550,
            'overlayClose': true,
            'onOpen': function (dialog) {
	            dialog.overlay.fadeIn(200, function () {
		            dialog.container.fadeIn(400);
		            dialog.data.fadeIn(400);
	            });
            },
            'onShow': function() {
                $('#simplemodal-container').corners('4px')
                                           .css({'height': 'auto', 'width': '550px'});
            }
        });
    },
    
    handle_text_highlight: function() {
        var $title_highlight = $('.NB-classifier-title-highlight', this.$classifier);
        var $title = $('.NB-classifier-title', this.$classifier);
        var $title_checkbox = $('#classifier_title', this.$classifier);
        
        var update = function() {
            var text = $.trim($(this).getSelection().text);
            
            if ($title.text() != text && text.length) {
                $title_checkbox.attr('checked', 'checked').change();
                $title.text(text).removeClass('NB-classifier-facet-disabled');
            }
        };
        
        $title_highlight.keydown(update).keyup(update).mousedown(update).mouseup(update).mousemove(update);
    },
    
    handle_select_checkboxes: function() {
        var self = this;
        var $submit = $('input[type=submit]', this.$classifier);
        
        $('input', this.$classifier).change(function() {
            var count = $('input:checked', self.$classifier).length;
            
            if (count) {
                $submit.removeClass("NB-disabled").removeAttr('disabled').attr('value', 'Save');
            } else {
                $submit.addClass("NB-disabled").attr('disabled', 'true').attr('value', 'Check what you like above...');
            }
        });
    },
    
    handle_cancel: function() {
        var $cancel = $('.NB-classifier-cancel', this.$classifier);
        
        $cancel.click(function(e) {
            e.preventDefault();
            $.modal.close();
        });
    },
    
    save: function() {
        
    }
    
};