export const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Running your code</title>
</head>
<body>
    <div id="root"></div>
    <script>
        window.addEventListener('message', (event)=>{
            try{
                eval(event.data)
            }catch(e){
                const root = document.querySelector('#root');
                const errorMessage = document.createElement('div');
                errorMessage.style.color = 'red';
                errorMessage.innerHTML = '<h4>Runtime Error</h4></p>'+e+'</p>';
                root.append(errorMessage)
                console.error(e)
            }
        }, false)
    </script>
</body>
</html>
`
