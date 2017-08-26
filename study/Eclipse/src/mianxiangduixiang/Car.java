package mianxiangduixiang;

//建立小汽车类
//定义类实际就是定义成员变量，成员变量包含成员变量和成员函数。
class Cardemo {
	private int speed; // 成员变量 或实例变量
	private String color;// 成员变量

	int age;// 成员变量 或实例变量
	static int age2=1235;//静态变量或类变量
	
	//构造函数
	//函数名与类名相同，不需要写返回值类型,
	//只会在对象构建时调用一次
	Cardemo(){
		System.out.println("gouzao hanshu ");
		
	}
	Cardemo(int speed,String color){
		this();//必须放在第一位
		this.speed=speed;
		this.color=color;
		
		
	}
	
	void run(){
		System.out.println(this.speed+"  "+this.age2);
	}
	
	public int getSpeed(){
		return speed;
	}
	public void setSpeed(int a){
		speed=a;
	} 
	//static 共享数据，不仅可以被对象使用，还能被类使用,生命周期很长，不放在堆里，放在数据区（方法区）
	public static void write(String con){
		System.out.println(con);
	}
	
}
public class Car{
	 int stat=555;
	
	//主函数是静态的，没法调用非静态的     String为调用那个的参数，在DOS命令里写 java Car haha hehe
	public static void main(String[] args){
		Car cars=new Car();
		System.out.println("length "+args.length);
		
		Cardemo car=new Cardemo(2000,"red");
		//car.speed=9;
		car.run();
		Cardemo car2=new Cardemo();
		//car.speed=9;
		car2.run();
		
		car2.write("1512315641");
		
	}
}
