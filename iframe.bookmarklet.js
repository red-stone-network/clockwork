javascript:(function(){
    var floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '5px';
    floatingDiv.style.right = '5px';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.backgroundColor = '#ffffff';
    floatingDiv.style.boxShadow = '0 0 5px rgba(0,0,0,.3)';
    floatingDiv.style.borderRadius = '5px';
    floatingDiv.style.overflow = 'hidden';
    floatingDiv.style.height = '450px';
    floatingDiv.style.width = '800px';
  
    var closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.color = 'red';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
      document.body.removeChild(floatingDiv);
    });
  
    var iframe = document.createElement('iframe');
    iframe.src = 'https://redstone-nw.netlify.app/clockwork-app/index.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
  
    floatingDiv.appendChild(closeButton);
    floatingDiv.appendChild(iframe);
    document.body.appendChild(floatingDiv);
  })();
  
