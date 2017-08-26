package javaCode;


//

class Dongwu{
    Dongwu(){
        System.out.println("what");
    }
    void show(){
        System.out.println("dongwu");
    }
}

class Mao extends Dongwu{
    void show(){
        System.out.println("mao");
    }
 }





public class 多态 {
    public static void main(String[] args) {
        //多态，使用父类的类型.但没法用子类的方法


        //Mao m=new Mao();
        Dongwu m=new Mao();//把猫对象提升为动物类型他，限制
        Mao newm=(Mao)m;//向下转型，通常是为了使用子类中的特有方法。只是转型，无法转Dongwu对象
        //Object m=new mao();

        m.show();

        //instanceof 判断构造对象
        if(newm instanceof Dongwu){
            System.out.println("newm是动物");
        }


    }

}
