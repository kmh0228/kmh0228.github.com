import 'package:flutter/material.dart';

class Pages4 extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Container(
        width:400,
        height:400,
        color:Colors.pink,
        child: Stack(
          children: <Widget>[
            Align(
              child:   Container(
                width:100,
                height:100,
                color:Colors.black
              ),
              alignment: Alignment(0, 0),
            )
            
          ]
        )
      );
    }
}