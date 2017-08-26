package mianxiangduixiang;

public class ArrayToolTest {
	
	private ArrayToolTest(){}//为了不让其他方法创建此对象。将此类构造函数私有化
	
	public static void main(String[] args){
		int[] arr={1,2,5,98,2,5,56,23};
		System.out.println(ArrayTool.max(arr));
	}
}
