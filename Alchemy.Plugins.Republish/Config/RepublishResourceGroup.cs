using Alchemy4Tridion.Plugins.GUI.Configuration;
using Alchemy4Tridion.Plugins.GUI.Configuration.Elements;

namespace Alchemy.Plugins.Republish.Config
{
    /// <summary>
    /// Represents the ResourceGroup element within the editor configuration that contains this plugin's files
    /// and references.
    /// </summary>
    public class RepublishResourceGroup : ResourceGroup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RepublishResourceGroup"/> class.
        /// </summary>
        public RepublishResourceGroup()
        {
            // When adding files you only need to specify the filename and not full path
            AddFile("PublishCommand.js");
            AddFile("UnPublishCommand.js");
            AddFile("Republish.css");

            // When referencing commandsets you can just use the generic AddFile with your CommandSet as the type.
            // Note that below is just a convenient way of doing the following:
            //   this.AddFile(FileTypes.Reference, "Alchemy.Plugins.HelloWorld.Commands.HelloCommandSet");
            AddFile<RepublishCommandSet>();

            Dependencies.AddAlchemyCore();
        }
    }
}
