using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace Alchemy.Plugins.Republish.Config
{
    /// <summary>
    /// Represents the <commandset /> GUI ext configuration element for your extension. Contains references
    ///   to your command JS files.
    /// </summary>
    /// <remarks>
    /// If you use the sugar syntax for creating commands via Alchemy.command(), or if you ensure your command
    ///   namespaces follow the Alchemy naming rules (Alchemy.Plugins.{YourPluginName}.Commands, you only need to
    ///   AddCommand() with the name of your command only.
    /// If your command uses another namespace convention, you'll have to use the second argument to pass in your full
    ///   interface name.
    /// </remarks>
    public class RepublishCommandSet : CommandSet
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RepublishCommandSet"/> class.
        /// </summary>
        public RepublishCommandSet()
        {
            this.AddCommand("Publish");
            this.AddCommand("UnPublish");
        }
    }
}
