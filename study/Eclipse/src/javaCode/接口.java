package javaCode;

//如果一个抽象类里都是抽象方法的时候，用接口定义

abstract class abc{
    abstract void a();
    abstract void b();
}

//定义接口不是class 是 interface
//接口里可以定义 抽象方法，全局常量
//接口中的成员都是public
//接口中固定写法会自动监控的

interface Demo{
    //全局常量,固定写法
    public static final double PI=3.14;

    //抽象方法固定写法
    public abstract void c();


    public abstract void a();
    public abstract void b();
}

interface Demo2{
    //全局常量,固定写法
    //public static final double PI=3.14;

    //抽象方法固定写法
    public abstract void c();

    public abstract int add(int a,int b);

    public abstract void a();
    public abstract void b();
}

//接口不需要继承了。直接实现
//继承有些是可以拿来用的。但接口全部是需要拿过来实现的。
//implements 实现的意思
//接口因为没有方法体，所以可以多实现
class DemoImpl implements Demo,Demo2{

    public void c(){}
    public void a(){}
    public void b(){}

    public int add(int a,int b){
        return a+b;
    }

}


//一个类继承一个类还可以实现多个接口
//接口的子类都符合自己的类型

class Fu{
    void set(){}
}

class Zi extends Fu implements Demo,Demo2{
    public void c(){}
    public void a(){}
    public void b(){}

    public int add(int a,int b){
        return a+b;
    }
}


//接口与接口之间是继承关系而且接口可以多继承
//不能多继承是因为有方法体原因，但接口没方法提，所提可以多继承
interface Demo3 extends Demo,Demo2{

}

//抽象类与接口的区别
//抽象类需要被继承，接口需要被实现
//抽象类只能但继承，接口可以多实现
//抽象类中可以定义抽象方法和非抽象方法。子类继承后可以直接是有非继承方法。接口中只能有抽想方法。必须被子类实现
//抽象类的继承是extends 接口的实现是 implements.



public class 接口 {

    public static void main(String[] args) {
        DemoImpl d=new DemoImpl();
        System.out.println(d.add(3,5));
    }
}


