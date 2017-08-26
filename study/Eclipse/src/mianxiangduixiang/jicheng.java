package mianxiangduixiang;

class obj {
	obj(int a){
		System.out.println("父类构造函数");
	}

	String name="obj";
	int num=4;
	private int mi=6;//无法被子类继承

	

	void getNum(){
		System.out.println(this.num);//super代表父类的空间，不代表父类的对象
	}
}

//继承 只能有一个父类  子类如果有属性，会不要父级的。
class People extends obj{//继承父类的时候调用了父类的构造函数，并且参数是空
	People(){
		super(1);//继承父类的时候默认调用了父类的构造函数，并且参数是空
	}
	String name="people";
	int num=5;
	void getName(){
		System.out.println(this.name);//super代表父类的空间，不代表父类的对象
		//System.out.println(this.mi);
	}
	
//	//改变父级继承来的方法
//	void getNum(){
//		//super.getNum();
//		System.out.println(this.num);//super代表父类的空间，不代表父类的对象
//		//System.out.println("new");
//	}

}



public class jicheng{
	public static void main(String[] args){
		People peo=new People();
		peo.getName();
		peo.getNum();//自己找不到。找父级的方法然后调用
	}
}

