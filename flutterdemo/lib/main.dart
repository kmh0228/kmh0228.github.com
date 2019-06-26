import 'package:flutter/material.dart';

void main(){
  runApp(MyApp());
}

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Scaffold(
          appBar: AppBar(
            title: Text(
              'flutterDemo'
            ),
          ),
          body:HomeContent()
        )
      );
    }
}

class HomeContent extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Center(
        child:Container(
          width:300.0,
          height:300.0,
          decoration: BoxDecoration(
            color:Colors.yellow,
            // borderRadius: BorderRadius.all(
            //   Radius.circular(150)
            // )
            borderRadius: BorderRadius.circular(150),
            // image:DecorationImage(
            //   image:NetworkImage('http://g.hiphotos.baidu.com/image/pic/item/d52a2834349b033b95e7b4601fce36d3d539bd19.jpg'),
            //   fit:BoxFit.cover
            // )
          ),
          child:ClipOval(
            // child: Image.network(
            //   'http://g.hiphotos.baidu.com/image/pic/item/d52a2834349b033b95e7b4601fce36d3d539bd19.jpg',
            //   fit:BoxFit.cover
            // ),
            child:Image.asset(
              "images/2.0x/test.jpg",
              fit:BoxFit.cover
            )
          )
          // child: Image.network(
          //   'http://g.hiphotos.baidu.com/image/pic/item/d52a2834349b033b95e7b4601fce36d3d539bd19.jpg',
          //   fit:BoxFit.cover
          // ),
        )
      );
    }
}
