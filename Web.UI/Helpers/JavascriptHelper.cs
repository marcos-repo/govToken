namespace Web.UI
{
    public static class JavascriptHelper
    {
        public static string Versao { get; private set; }

        static JavascriptHelper()
        {
            Versao = Guid.NewGuid().ToString().Substring(0, 8);
        }
    }
}
