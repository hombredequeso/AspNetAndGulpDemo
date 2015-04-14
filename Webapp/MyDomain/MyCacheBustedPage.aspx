<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MyCacheBustedPage.aspx.cs" Inherits="Webapp.MyDomain.MyCacheBustedPage" %>
<%@ Import Namespace="Webapp" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
 <script src="<%=CacheBuster.JsFileNameResolver(Server, "/Scripts/appBundles/myDomain.min.js") %>" type="text/javascript"></script>
 <script>
    document.addEventListener('DOMContentLoaded', function () {
        var myvm = myApp.myDomain.myPageViewModel();

        document.getElementById("myLabelId").innerHTML = myvm.description;

        console.log('DOMContentLoaded listener called');

});
 </script>

<body>
    <form id="form1" runat="server">
    <div>
        <label id="myLabelId">LabelTextAsSetInHtml</label>
    </div>
    </form>
</body>
</html>
