package javaCode;

//第一种方法，继承Thread.重写run，启动start
class dxcde extends Thread{

}
//如果此类已经有父级，无法继承Thread,则实现接口
class dxFu{

}
class dxZi extends dxFu implements Runnable{
    //类中的方法只有一个run
    public void run(){
        System.out.println("我是多线程");
    }

}


public class 多线程的第二种实现方式 {
    public static void main(String[] args) {
        //把实现runnable接口的类给thread
        dxZi e=new dxZi();
        Thread d=new Thread(e);
        d.start();
    }
}
