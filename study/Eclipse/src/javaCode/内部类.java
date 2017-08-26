package javaCode;

//class fu{
//}
//
//class wai{
//    private int num=5;
//    //编译后是 wai$nei.class
//    class nei{
//        int num=8;
//        void show(){
//            System.out.println(wai.this.num);//访问外部类成员的方法。因为内部类拥有外部类的引用 外部名.this
//            System.out.println(num);
//        }
//    }
//    static class nei2{
//        void show(){
//            System.out.println("what");
//        }
//    }
//
//    //匿名内部类
//    //必须是继承父级或者实现借口
//    new fu(){
//        void show(){
//            System.out.println("what");
//    }
//
//    void show(){
//        new nei().show();
//    }
//
//}
//
//
//
//public class 内部类 {
//    public static void main(String[] args) {
//        wai a=new wai();
//        System.out.println("neibulei");
//        a.show();
//
//        //直接访问内部类,内部的共有类
//        wai.nei b=new wai().new nei();
//        b.show();
//        //如果内部类是静态
//        wai.nei2 c=new wai.nei2();
//        c.show();
//        //如果内部类有静态成员，此类也必须是静态的
//    }
//}
