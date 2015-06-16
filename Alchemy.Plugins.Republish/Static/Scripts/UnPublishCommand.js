/**
 * Creates an anguilla command using a wrapper shorthand. The command will communicate with the web service
 * to return a message.
 *
 * Note the ${PluginName} will get replaced by the actual plugin name.
 */
Alchemy.command("${PluginName}", "UnPublish", {
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
    execute: function () {
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

            if (items.length > 0) {
                // build params
                var params = { command: "unpublish", items: items, userWorkflow: false };

                p.popup = $popup.create($cme.Popups.PUBLISH.URL, $cme.Popups.PUBLISH.FEATURES, params);
                $evt.addEventHandler(p.popup, "unload",
                function execute$Unload(event) {
                    if (p.popup) {
                        p.popup.dispose();
                        p.popup = null;
                    }
                });
                
                $evt.addEventHandler(p.popup, "error",
                function execute$Error(event) {
                    $messages.registerError(event.data.error.Message, null, null, null, true);

                    if (p.popup) {
                        p.popup.dispose();
                        p.popup = null;
                    }
                });
                
                $evt.addEventHandler(p.popup, "unpublish",
                function execute$Unpublished(event) {
                    var item = $models.getItem(event.data.item);
                    $messages.registerNotification($localization.getEditorResource("PublishPopupSentToPublishQueue", item ? item.getStaticTitle() || item.getTitle() || item.getId() : event.data.item));

                    if (p.popup) {
                        p.popup.dispose();
                        p.popup = null;
                    }
                });

                $evt.addEventHandler(p.popup, "multiunpublish", this.getDelegate(this.onMultiUnpublish));

                p.popup.open();
            }
        }
    },
    
    onMultiUnpublish: function (event) {
        var p = this.properties;
        var items = event.data.items;
        var instruction = event.data.instruction;

        var msg = $messages.registerProgress(
            $localization.getEditorResource("PublishPopupItemsUnPublishing", [items.length])
        );

        function onMultiUnpublish$OnSendToQueue(total) {
            msg.finish();
            if (p.popup) {
                p.popup.dispose();
                p.popup = null;
            }
            $messages.registerNotification($localization.getEditorResource("PublishPopupItemsSentToPublishQueue").format(total));
        };

        function onMultiUnpublish$OnSendToQueueFailed() {
            msg.finish();
            $messages.registerError($localization.getEditorResource("PublishPopupItemsSentToPublishQueueFailed"));
        };

        tridion.Web.UI.ContentManager.Publishing.UnpublishItems(
            items,
            instruction,
            onMultiUnpublish$OnSendToQueue,
            onMultiUnpublish$OnSendToQueueFailed
        );
    }
    
});