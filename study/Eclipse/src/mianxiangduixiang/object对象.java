package mianxiangduixiang;


class a{
    int age=5;
}

class b{}



public class object对象 {
    public static void main(String[] args) {
        //equals
        a a1=new a();
        a a2=new a();
        a a3=a2;
        boolean bo=a1.equals(a2);
        boolean bo2=a2.equals(a3);
//        System.out.println(bo);
//        System.out.println(bo2);//equals 判断两个对象是否相等

        //hashCode
//        System.out.println(a2);
//        System.out.println(Integer.toHexString(a3.hashCode()));//HASH值即是位子引用代码。判断两个对象一样。不仅用equals判定内容相同。同时还要判断hash码相同

        //getClass
        Class c1=a2.getClass();
        Class c2=a3.getClass();

//        System.out.print(c1==c2);

        //toString
        System.out.print(a1.toString());

    }
}
