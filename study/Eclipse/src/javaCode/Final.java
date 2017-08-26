package javaCode;

class fu{//final修饰类 不让后代继承

    final void fangfa(){

    }// final修饰的方法不能被覆盖

    final int name=5;//final修饰的常量只能赋值一次

}

final class zi extends  fu{

}







final public class Final {

    static int num=5;

    public static void main(String[] args) {
        System.out.println(num);
    }
}
