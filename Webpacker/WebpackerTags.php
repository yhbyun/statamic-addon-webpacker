<?php

namespace Statamic\Addons\Webpacker;

use Statamic\Extend\Tags;
use Statamic\API\File;
use \Statamic\Addons\Webpacker\WebpackerTrait;

class WebpackerTags extends Tags
{
  use WebpackerTrait;

  /**
   * The {{ webpacker:base }} tag - outputs tags for manifest, vendors et commons JS file if enabled
   *
   * @return string
   */
  public function base()
  {
    $buffer;

    // Add menifest asset if enabled
    if ($this->getConfig('manifest')) {
      $buffer = $this->asset('js', 'manifest', false, 'defer');
    }

    // Add vendors asset if enabled
    if ($this->getConfig('vendors')) {
      $buffer .= "\n" . $this->asset('js', 'vendors', false, 'defer');
    }

    // Add commons asset if enabled
    if ($this->getConfig('commons')) {
      $buffer .= "\n" . $this->asset('js', 'commons', false, 'defer');
    }

    return $buffer;
  }

  /**
   * The {{ webpacker:css }} tag - outputs the URL or tag for CSS file.
   *
   * @return string
   */
  public function css()
  {
    $baseName = $this->getParam('src');
    $tag = $this->getParam('tag');

    return $this->asset('css', $baseName, $tag);
  }

  /**
   * The {{ webpacker:js }} tag - outputs the URL or tag for JS file.
   *
   * @return string
   */
  public function js()
  {
    $baseName = $this->getParam('src');
    $tag = $this->getParam('tag');
    $attr = $this->getParam('attr');

    return $this->asset('js', $baseName, $tag, $attr);
  }
}
