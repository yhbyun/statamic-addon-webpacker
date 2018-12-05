<?php

namespace Statamic\Addons\Webpacker;

use Statamic\API\Config;
use Statamic\API\File;
use Statamic\API\URL;
use Statamic\Extend\Extensible;

class Webpacker
{
  use Extensible;

  /**
   * Add js or css asset
   *
   * @param string $fileExt
   * @param string $baseName
   * @param string $tag
   * @param string $attr
   *
   * @return string the URL or tag for asset file
   *
   * @throws RuntimeException
   */
  public function addAsset($fileExt, $baseName, $tag = false, $attr = null)
  {
    // Stop here if baseName is null
    if (is_null($baseName)) {
      // Trow missing entry name
      throw new \RuntimeException("The {{ webpacker:{$fileExt} }} tag must have a src parameter");
    }

    // The name of the manifest file.
    $manifest = 'webpacker.json';

    // Files infos
    $fileName = $baseName . '.' . $fileExt;

    // $theme root path
    $themeRootPath = root_path(URL::assemble(Config::get('system.filesystems.themes.root'), Config::get('theming.theme')));

    // Hot file path
    $hotPath = URL::assemble($themeRootPath, 'hot');

    // Development server
    $devServer = @fsockopen('localhost', '3001');

    // Manifest path
    $manifestPath = URL::assemble($themeRootPath, $this->getConfig('output_folder'), $manifest);

    // If mode is development (development server is active and hot file exit)
    if (is_resource($devServer) && File::exists($hotPath)) {
      // Asset path
      $assetPath = "/js/{$baseName}.js";

      // Add JS
      return $this->addJs($assetPath, true, $attr);

    // If mode is production (wepacker.json exist)
    } elseif (file_exists($manifestPath)) {
      // Array of assets paths from wepacker.json
      $assetsList = json_decode(File::get($manifestPath), true);

      // Stop here if asset isn't in wepacker.json
      if (empty($assetsList[$fileName])) {
        throw new \RuntimeException("{$fileName} isn't in {$manifest}, please run webpacker:prod script from your theme folder again");
      }

      // Asset path
      $assetPath = $assetsList[$fileName];

      // Stop here if asset file doesn't exist
      if (!file_exists(root_path($assetPath))) {
        // Trow missing file error
        throw new \RuntimeException("{$fileName} is in {$manifest} but the file cant't be found, please run webpacker:prod script from your theme folder again");
      }

      // Check if file extension is CSS
      if ($fileExt === 'css') {
        // Add CSS
        return $this->addCss($assetPath, $tag);

      // Check if file extension is JS
      } elseif ($fileExt === 'js') {
        // Add JS
        return $this->addJs($assetPath, $tag, $attr);
      }

    // Trow missing wepacker.json error
    } else {
      throw new \RuntimeException("{$manifest} doesn't exist and developement server is not active. Please run webpacker:prod or webpacker:dev script from your theme folder");
    }
  }

  /**
   * Add css asset
   *
   * @param string $assetPath
   * @param string $tag
   *
   * @return string
   */
  private function addCss($assetPath, $tag)
  {
    if (isset($tag)) {
      if ($tag === 'inline') {
        $cssFileContent = trim(File::get($assetPath));

        return "<style>\n{$cssFileContent}\n</style>";
      }

      return "<link rel=\"stylesheet\" href=\"{$assetPath}\">";
    }

    return $assetPath;
  }

  /**
   * Add js asset
   *
   * @param string $assetPath
   * @param string $tag
   * @param string $attr
   *
   * @return string
   */
  private function addJs($assetPath, $tag, $attr)
  {
    if ($tag === true) {
      $attributes = $attr ?? '';

      return "<script src=\"{$assetPath}\" {$attributes}></script>";
    } elseif ($tag === 'inline') {
      $jsFileContent = trim(File::get($assetPath));

      return "<script>\n{$jsFileContent}\n</script>";
    } else {
      return $assetPath;
    }
  }
}
