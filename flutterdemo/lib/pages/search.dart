import 'package:flutter/material.dart';
import './form.dart';

class Search extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Column(
        children: <Widget>[
          RaisedButton(
            child: Text('跳转到列表页面'),
            onPressed: (){

                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => form()
                    )
                  );
            },
          ),
          RaisedButton(
            child: Text('fanhui'),
            onPressed: (){
              Navigator.of(context).pop();
            },
          )
        ],
      );
    }
}

