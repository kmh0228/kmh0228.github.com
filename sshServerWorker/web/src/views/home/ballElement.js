export default function(inner,color){
    var inner = inner || '';
    var color = color || '#fff';
    var e = document.createElement('div');
    e.innerHTML = inner;
    e.style.width = e.style.height = '100%';
    e.style.borderRadius = '50%';
    e.style.backgroundColor = 'yellow';

    return e;
}