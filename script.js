$(document).ready(function() {
    // Initialize default settings and constants
    let status = 'draw';
    let col;
    let row;
    let isMouseDown = false;
    let color;
    const MAX_ALLOWED_HEIGHT = 30;
    const MAX_ALLOWED_WIDTH = 30;
    
    // Function to create a grid based on user input dimensions
    function makeGrid() {
        row = $('#input_height').val();
        col = $('#input_width').val();
    
        // Append rows and columns to the canvas
        $('#pixel_canvas').append(function() {
            let newHtml = '';
            row = Number(row);
            col = Number(col);
            for(let i = 0; i < row; i++){
                newHtml += '<tr>';
                for(let j = 0; j < col; j++){
                    newHtml += '<td></td>';		
                }
                newHtml += '</tr>';
            }
            return newHtml;
        });
    };
    
    // Event handler to generate new grid on form submission
    $('#size_picker').on('submit', function(e) {
        e.preventDefault();
        $('#pixel_canvas').empty();
        makeGrid();
    });
    
    // Event handlers for mouse operations on grid cells
    $('#pixel_canvas').on('mousedown', 'td', function(e) {
        e.preventDefault();
        isMouseDown = true;
    
        color = $('input#color_picker').val();
    
        if(status === 'draw'){
            $(this).css({'background-color': color});
        } else if (status === 'erase'){
            $(this).removeAttr('style');
        } else if (status === 'fill'){
            $('td').css({'background-color': color});
        }	
    }).on('mouseover', 'td', function() {
        if(isMouseDown && status === 'draw') {
            $(this).css({'background-color': color});
        } else if (isMouseDown && status === 'erase'){
            $(this).removeAttr('style');
        }
    });
    $(document).mouseup(function() {
        isMouseDown = false;
    });
    
    // Context menu prevention and cell style reset on right-click
    $('#pixel_canvas').on('contextmenu', 'td', function(e) {
        e.preventDefault();
        $(this).removeAttr('style');
    });
    
    // Toggle grid borders visibility
    $('.borderToggleBtn').on('click', function(){
        $('tr, td').toggleClass('transparentBorder');
    });
    
    // Clear all styles from the grid
    $('.clearGrid').on('click', function(){
        $('td').removeAttr('style');
    });
    
    // Add and remove columns
    $('.addCol').on('click', function(){
        if(col < MAX_ALLOWED_WIDTH){
            $('tr').append('<td></td>');
            col++;
        }
    });
    $('.removeCol').on('click', function(){
        if(col > 0){
            $('tr td:last-child').remove();
            col--;
        }
    });
    
    // Add and remove rows
    $('.addRow').on('click', function(){
        if(row < MAX_ALLOWED_HEIGHT){
            row++;
            let temp = '';
            for (let k = 0; k < col; k++) {
                temp += '<td></td>';
            }
            $('table').append('<tr>' + temp + '</tr>');
        }
    });
    $('.removeRow').on('click', function(){
        if(row > 0){
            $('tr:last-child').remove();
            row--;
        }
    });
    
    // Tool selection and activation
    $('.tools').click(function(){
        $('.tools').removeClass('active');
        $(this).addClass('active');
        status = $(this).attr('title').toLowerCase();
    });
    
    // Export the grid as a PNG image
    $('.save').click(function(){
        html2canvas($("#pixel_canvas").get(0), {
            onrendered: function (canvas) {
                var a = document.createElement('a');
                a.href = canvas.toDataURL("image/png");
                a.download = 'MyPixelArt.png';
                a.click();
            }
        });
    });
});
