package javaCode;

public class 快速实现多线程 {
    public static void main(String[] args) {

        new Thread(){
            public void run(){
                System.out.print("第一种");
            }
        }.start();

        Runnable r=new Runnable() {
            @Override
            public void run() {
                System.out.print("第二种");
            }
        };
        new Thread(r).start();



    }
}
