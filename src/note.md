# 抗锯齿

## 硬件抗锯齿

goodbye antialias

## 多重采样 MSAA

需要 WebGl2.0 支持

```js
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0
})

const effectComposer = new EffectComposer(renderer, renderTarget)
```

## 后期处理

抗锯齿算法

- FXAA：性能好, 但是结果只能说还可以, 并且会模糊.
- SMAA：通常比 FXAA 好但性能低, 不要与 MSAA 混淆.
- SSAA：最高的质量, 最低的性能.
- TAA: 基于前后帧, 动态场景效果好, 静态场景不如其它算法, 且有更大开销.
