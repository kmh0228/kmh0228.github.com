package javaCode;

//抽象类
//抽象方法必须定义在抽象类中
//可以定义非抽象方法
//抽象类不可以被实例化，不可以用new创建
//抽象类必须被子类覆盖所有方法，子类才能被实例化,否则，子类还是抽象类
//抽象类里可以不定义抽象方法，。但是很少见。
//抽象方法不能被私有。不能被静态
//abstract与 private,static，final不能共存


abstract class demo{//abstract 修饰抽象类
    abstract void show();//抽象的方法，知道有这个方法，但是不知道这方法干什么的
}


class demoA extends demo{
    void show(){
        System.out.println("demoa");
    }
}

class demoB extends demo{
    void show(){
        System.out.println("demob");
    }
}




public class chouxiang {
    public static void main(String[] args) {
        new demoA().show();
    }
}
