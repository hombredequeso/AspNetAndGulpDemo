using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace Webapp
{
	public static class CacheBuster
	{
		public static bool DoNotCacheJsFileNameResolver =
			ConfigurationManager.AppSettings["DoNotCacheJsFileNameResolver"] != null;

		public static string JsFileNameResolver(
			HttpServerUtility server, 
			string fileName)
		{
			return (DoNotCacheJsFileNameResolver)?
				GetCacheBustedFileName((p, f) => FilesIn(server, p, f),fileName):
				GetCacheBustedFileNameCached((p, f) => FilesIn(server, p, f), fileName);
		}


		public static ConcurrentDictionary<string, string> CacheBustedFileNameCache = 
			new ConcurrentDictionary<string, string>();

		public static string GetCacheBustedFileNameCached(
			Func<string, string, List<string>> fileResolver,
			// path, fileMatchingPattern, returns matching files (usually CacheBuster.FilesIn)
			string appBundleJsFilename)
		{
			if (CacheBustedFileNameCache.ContainsKey(appBundleJsFilename))
				return CacheBustedFileNameCache[appBundleJsFilename];
			var result = GetCacheBustedFileName(fileResolver, appBundleJsFilename);
			CacheBustedFileNameCache[appBundleJsFilename] = result;
			return result;
		}

		public static string GetCacheBustedFileName(
			Func<string, string, List<string>> fileResolver, 
			// path, fileMatchingPattern, returns matching files. 
			//(fileResolver is usually CacheBuster.FilesIn, except for testing)
			string appBundleJsFilename)
		{
			var serverPath = Path.GetDirectoryName(appBundleJsFilename);
			var extension = Path.GetExtension(appBundleJsFilename);
			var fileNameMinusExtension = Path.GetFileNameWithoutExtension(appBundleJsFilename);
			var matchingFiles = fileResolver(serverPath, string.Format("{0}.*{1}", fileNameMinusExtension, extension));
			var result = Path.Combine(serverPath, matchingFiles.Single());
			return result.Replace("\\", "/");
		}

		public static List<string> FilesIn(HttpServerUtility server, string serverPath, string matchingPattern)
		{
			DirectoryInfo diFiles = new DirectoryInfo(server.MapPath(serverPath));
			return diFiles.GetFiles(matchingPattern).Select(x => x.Name).ToList();
		}
	}
}