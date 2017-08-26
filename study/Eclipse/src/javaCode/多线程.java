package javaCode;

class dxc{
    String getN(){
        return "dxc";
    }
}

class myd extends Thread{
    public void run(){
        for(int i=0;i<1;i++){
            System.out.println("我是多线程"+i);
        }
    }
}


public class 多线程 {
    public static void main(String[] args) {
        dxc d=new dxc();
        //系统的多线程，定义在主方法里
        System.gc();//启动垃圾回收器

        //自定义线程，用的是thread里面的run方法，但是不能用。所以要写个类继承Thread方法，并复写run方法，把代码写在run里
        Thread t1=new Thread();
        myd m=new myd();
        m.start();//使用时用start开启线程，他自己调用方法
        for(int i=0;i<1;i++){
            System.out.println("我是主函数"+i);
        }
        myd m2=new myd();

        System.out.println(m.getName());//线程有名字
        System.out.println(m2.getName());//线程有名字

        System.out.println(Thread.currentThread());//获取当前运行的线程


    }

}
