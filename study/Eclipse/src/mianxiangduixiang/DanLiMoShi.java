package mianxiangduixiang;

//开发用这个比较多
class Single{
	private static Single s=new Single();
	private Single(){}

	public static Single getInstance (){
		return s;
	}

}

//懒汉模式  有弊端
class Single2{
	private static Single2 s=null;
	private Single2(){}


	public static Single2 getInstance (){
		if(s==null)s=new Single2();
		return s;
	}

}


public class DanLiMoShi {
//	public static void main(String[] args){
//		
//		System.out.println(Single.getSingle());
//		
//	}
}
