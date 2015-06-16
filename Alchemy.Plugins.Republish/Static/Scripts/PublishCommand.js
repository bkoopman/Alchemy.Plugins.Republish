/**
 * Creates an anguilla command using a wrapper shorthand. The command will communicate with the web service
 * to return a message.
 *
 * Note the ${PluginName} will get replaced by the actual plugin name.
 */
Alchemy.command("${PluginName}", "Publish", {
    /**
     * Whether or not the command is enabled for the user (will usually have extensions displayed but disabled).
     * @returns {boolean}
     */
    isEnabled: function (selection) {
        return this.isAvailable(selection);
    },

    /**
     * Whether or not the command is available to the user.
     * @returns {boolean}
     */
    isAvailable: function (selection) {
        if (selection.getCount() >= 1) {
            for (var i = 0; i < selection.getCount() ; i++) {
                var itemType = $models.getItemType(selection.getItem(i));
                if (itemType == $const.ItemType.PUBLISH_TRANSACTION) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Executes your command. You can use _execute or execute as the property name.
     */
    execute: function (selection) {
        var p = this.properties;

        // there must be at least one item selected
        if (!selection || selection.getCount() == 0) {
            return;
        }

        // popup management
        if (p.popup) {
            p.popup.focus();
        }
        else {
            var items = [];
            for (var i = 0; i < selection.getCount() ; i++) {
                var id = selection.getItem(i);
                var item = $models.getItem(id);

                if (Type.isFunction(item.getPublishItemId)) {
                    // get item from publish transaction
                    id = item.getPublishItemId();
                    items.push(id);
                }
            }
            this.openPublishPopup(items);
        }
    },
    
    onMultiPublish: function(event) {
        var p = this.properties;
        var items = event.data.items;
        var instruction = event.data.instruction;

        var msg = $messages.registerProgress(
            $localization.getEditorResource("PublishPopupItemsPublishing", [items.length])
        );

        function onMultiPublish$OnSendToQueue(total) {
            msg.finish();
            if (p.popup) {
                p.popup.dispose();
                p.popup = null;
            }
            $messages.registerNotification($localization.getEditorResource("PublishPopupItemsSentToPublishQueue").format(total));
        };

        function onMultiPublish$OnSendToQueueFailed(error) {
            msg.finish();
            $messages.registerError(error.Message, null, null, true, false);
        };

        tridion.Web.UI.ContentManager.Publishing.PublishItems(
            items,
            instruction,
            onMultiPublish$OnSendToQueue,
            onMultiPublish$OnSendToQueueFailed
        );        
    },

    openPublishPopup: function(items) {
        var p = this.properties;

        // build params
        var doRepublish = false;

        for (var i = 0, cnt = items.length; i < cnt; i++) {
            var type = $models.getItemType(items[i]);
            if (type == $const.ItemType.PUBLICATION || type == $const.ItemType.STRUCTURE_GROUP) {
                doRepublish = true;
                break;
            }
        }

        var params = { command: "publish", items: items, republish: doRepublish, userWorkflow: false };

        p.popup = $popup.create($cme.Popups.PUBLISH.URL, $cme.Popups.PUBLISH.FEATURES, params);

        $evt.addEventHandler(p.popup, "unload",
		    function openPublishPopup$Unload(event) {
		        if (p.popup) {
		            p.popup.dispose();
		            p.popup = null;
		        }
		    });
        
        $evt.addEventHandler(p.popup, "error",
		    function openPublishPopup$Error(event) {
		        $messages.registerError(event.data.error.Message, null, null, null, true);

		        if (p.popup) {
		            p.popup.dispose();
		            p.popup = null;
		        }
		    });
        
        $evt.addEventHandler(p.popup, "publish",
		    function openPublishPopup$Published(event) {
		        var item = $models.getItem(event.data.item);
		        $messages.registerNotification($localization.getEditorResource("PublishPopupSentToPublishQueue", item ? item.getStaticTitle() || item.getTitle() || item.getId() : event.data.item));

		        if (p.popup) {
		            p.popup.dispose();
		            p.popup = null;
		        }
		    });

        $evt.addEventHandler(p.popup, "multipublish", this.getDelegate(this.onMultiPublish));

        p.popup.open();
    }

});