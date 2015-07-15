using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace Alchemy.Plugins.Republish.Config
{
    /// <summary>
    /// Represents an extension element in the editor configuration for creating a context menu extension.
    /// </summary>
    public class RepublishContextMenu : ContextMenuExtension
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RepublishContextMenu"/> class.
        /// </summary>
        public RepublishContextMenu()
        {
            // This is the id which gets put on the html element for this menu (to target with css/js).
            AssignId = "RepublishContextMenu"; 

            // The name of the extension menu
            Name = "RepublishContextMenu";

            // Where to add the new menu in the current context menu.
            InsertBefore = "cm_sep_0";

            AddSeparator("cm_pq_sep_0");
            AddSubMenu("cm_pq_pub", "{Resources: Tridion.Web.UI.Strings, Publishing}")
                .AddItem("cm_pq_publish", "{Resources: Tridion.Web.UI.Strings, Publish}", "Publish")
                .AddItem("cm_pq_unpublish", "{Resources: Tridion.Web.UI.Strings, UnPublish}", "UnPublish");

            // We need to addd our resource group as a dependency to this extension
            Dependencies.Add<RepublishResourceGroup>();

            // Actually apply our extension to a particular view.  You can have multiple.
            Apply.ToView("*", "PublishQueueContextMenu");
        }
    }
}
