<?php

namespace Statamic\Addons\Webpacker;

use Statamic\Extend\Tags;
use Statamic\Addons\Webpacker\Webpacker;

class WebpackerTags extends Tags
{
  private $webpacker;

  protected function init()
  {
    $this->webpacker = new Webpacker;
  }

  /**
   * The {{ webpacker:base }} tag - outputs tags for manifest, vendors et commons JS file if enabled
   *
   * @return string
   */
  public function base()
  {
    $buffer = null;

    // Add runtime asset if enabled
    if ($this->getConfig('runtime')) {
      $buffer = $this->webpacker->addAsset('js', 'runtime', 'inline');
    }

    // Add vendor asset if enabled
    if ($this->getConfig('vendor')) {
      $buffer .= "\n" . $this->webpacker->addAsset('js', 'vendor', true, 'defer');
    }

    // Add common asset if enabled
    if ($this->getConfig('common')) {
      $buffer .= "\n" . $this->webpacker->addAsset('js', 'common', true, 'defer');
    }

    return $buffer;
  }

  /**
   * The {{ webpacker:css }} tag - outputs the URL or tag for CSS file
   *
   * @return string
   */
  public function css()
  {
    $baseName = $this->getParam('src');
    $tag = $this->getParam('tag');

    return $this->webpacker->addAsset('css', $baseName, $tag);
  }

  /**
   * The {{ webpacker:js }} tag - outputs the URL or tag for JS file
   *
   * @return string
   */
  public function js()
  {
    $baseName = $this->getParam('src');
    $tag = $this->getParam('tag');
    $attr = $this->getParam('attr');

    return $this->webpacker->addAsset('js', $baseName, $tag, $attr);
  }
}
