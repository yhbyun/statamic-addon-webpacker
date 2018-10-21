<?php

namespace Statamic\Addons\Webpacker;

use Statamic\API\Config;
use Statamic\API\File;
use Statamic\API\Str;
use Statamic\API\URL;
use Statamic\Extend\HasParameters;

trait WebpackerTrait
{
  /**
   * Provides access to methods for retrieving parameters
   */
  use HasParameters;

  //  The name of the manifest file.
  static $manifest = 'webpacker.json';

  //  Error title
  static $errorTitle = 'Webpacker Addon Error: ';

  /**
   * Webpacker asset function
   *
   * @param string $fileExt
   * @param string $baseName
   * @param string $tag
   * @param string $attr
   *
   * @return string
   *
   * @throws RuntimeException
   */
  public function asset($fileExt, $baseName, $tag = false, $attr = null)
  {
    // Files infos
    $fileName = $baseName . '.' . $fileExt;

    // $theme root path
    $themeRootPath = root_path(URL::assemble(Config::get('system.filesystems.themes.root'), Config::get('theming.theme')));

    // hot file path
    $hot = URL::assemble($themeRootPath, 'hot');

    // If mode is development
    if (File::exists($hot)) {
      // Asset path
      $assetPath = "/js/{$baseName}.js";

      // Development server is active
      $devServer = is_resource(@fsockopen('localhost', '3001'));

      // Check if webpacker script is running in development mode
      if ($devServer) {
        return $this->addJs($assetPath, false, $attr);

      // Trow webpacker script is not running in development mode
      } else {
        throw new \RuntimeException(static::$errorTitle . 'please check if webpacker script is actually running in development mode');
      }

    // If mode is production
    } else {
      $manifestPath = URL::assemble($themeRootPath, $this->getConfig('output_folder'), static::$manifest);

      // Check if wepack-assets.json exist
      if (file_exists($manifestPath)) {
        // Array of assets paths from wepack-assets.json
        $assetsList = collect(json_decode(File::get($manifestPath), true));

        // Asset path
        $assetPath = $assetsList[$fileName];

        // Check if the file exist
        if (file_exists(root_path($assetPath))) {

          // Check if file extension is CSS
          if ($fileExt === 'css') {
            // Add CSS
            return $this->addCss($assetPath, $tag);

          // Check if file extension is JS
          } elseif ($fileExt === 'js') {
            // Add JS
            return $this->addJs($assetPath, $tag, $attr);
          }

          // Trow missing file error
        } else {
          throw new \RuntimeException(static::$errorTitle . $fileName . ' doesn\'t exist, please run webpacker:prod script from your theme folder');
        }

        // Trow missing wepack-assets.json error
      } else {
        throw new \RuntimeException(static::$errorTitle . static::$manifest . ' doesn\'t exist, please run webpacker:prod script from your theme folder');
      }
    }
  }

  /**
   * Add css
   *
   * @param string $assetPath
   * @param string $tag
   *
   * @return string
   */
  public function addCss($assetPath, $tag)
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
   * Add js
   *
   * @param string $assetPath
   * @param string $tag
   * @param string $attr
   *
   * @return string
   */
  public function addJs($assetPath, $tag, $attr)
  {
    $attributes = $attr ?? '';

    if (isset($tag)) {
      if ($tag === 'inline') {
        $jsFileContent = trim(File::get($assetPath));

        return "<script>\n{$jsFileContent}\n</script>";
      }

      return "<script src=\"{$assetPath}\" {$attributes}></script>";
    }

    return $assetPath;
  }
}
