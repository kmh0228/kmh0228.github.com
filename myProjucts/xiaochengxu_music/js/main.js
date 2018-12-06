import './config'
let ctx   = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    
    this.restart()
  }

  restart() {

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    

    ctx.fillStyle = '#fff';
    ctx.fillText('hello word',200,200);
    //ctx.fillStyle = '#fff';
    

  }

  add(obj){
    obj.add();
  }

 
}
