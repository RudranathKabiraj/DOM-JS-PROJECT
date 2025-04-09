//at first we have to load student data from local storage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const storedData = JSON.parse(localStorage.getItem('students')) || [];
    storedData.forEach(student => {
        addStudentToTable(student.name, student.id, student.class, student.rollNo, student.email);
    });
});

// submitting form logic
document.getElementById('student-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('student-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const studentClass = document.getElementById('student-class').value.trim();
    const rollNo = document.getElementById('roll-no').value.trim();
    const email = document.getElementById('email').value.trim();
    const editIndex = document.getElementById('edit-index').value;

    if (!validateInputs(name, studentId, studentClass, rollNo, email)) {
        return;
    }

    if (editIndex === "") {
        addStudentToTable(name, studentId, studentClass, rollNo, email);
        saveStudentToLocalStorage(name, studentId, studentClass, rollNo, email);
    } else {
        updateStudent(parseInt(editIndex), name, studentId, studentClass, rollNo, email);
    }
    resetForm();
});

// validateInputs will validate the inputs before adding to the table
function validateInputs(name, studentId, studentClass, rollNo, email) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const idRegex = /^[0-9]+$/;
    const rollRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name || !studentId || !studentClass || !rollNo || !email) {
        alert("All fields are required!");
        return false;
    }
    if (!nameRegex.test(name)) {
        alert("Student name should only contain letters.");
        return false;
    }
    if (!idRegex.test(studentId)) {
        alert("Student ID should only contain numbers.");
        return false;
    }
    if (!rollRegex.test(rollNo)) {
        alert("Roll number should only contain numbers.");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Enter a valid email address.");
        return false;
    }
    return true;
}

// addStudentToTable will add student data to the table
function addStudentToTable(name, studentId, studentClass, rollNo, email) {
    const tableBody = document.getElementById('table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${studentId}</td>
        <td>${studentClass}</td>
        <td>${rollNo}</td>
        <td>${email}</td>
        <td>
            <button class="action-btn" onclick="editStudent(this)">Edit</button>
            <button class="action-btn" onclick="deleteStudent(this)">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
    updateScroll();
}

// function to save student data to local storage
function saveStudentToLocalStorage(name, studentId, studentClass, rollNo, email) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.push({ name, id: studentId, class: studentClass, rollNo, email });
    localStorage.setItem('students', JSON.stringify(students));
}

// Editing student details
function editStudent(btn) {
    const row = btn.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');
    const tableBody = document.getElementById('table-body');

    document.getElementById('student-name').value = cells[0].innerText;
    document.getElementById('student-id').value = cells[1].innerText;
    document.getElementById('student-class').value = cells[2].innerText;
    document.getElementById('roll-no').value = cells[3].innerText;
    document.getElementById('email').value = cells[4].innerText;
    document.getElementById('edit-index').value = Array.from(tableBody.children).indexOf(row);
    document.getElementById('updateButton').style.display = "inline-block";
    document.querySelector('.btn[type="submit"]').style.display = "none";
}

// Updating student details in the table and local storage
function updateStudent(index, name, studentId, studentClass, rollNo, email) {
    const tableBody = document.getElementById('table-body');
    const row = tableBody.children[index];

    if (row) {
        row.children[0].innerText = name;
        row.children[1].innerText = studentId;
        row.children[2].innerText = studentClass;
        row.children[3].innerText = rollNo;
        row.children[4].innerText = email;

        let students = JSON.parse(localStorage.getItem('students')) || [];
        students[index] = { name, id: studentId, class: studentClass, rollNo, email };
        localStorage.setItem('students', JSON.stringify(students));
    }
}

// this is the code for update button
document.getElementById('updateButton').addEventListener('click', function () {
    const name = document.getElementById('student-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const studentClass = document.getElementById('student-class').value.trim();
    const rollNo = document.getElementById('roll-no').value.trim();
    const email = document.getElementById('email').value.trim();
    const editIndex = document.getElementById('edit-index').value;

    if (!validateInputs(name, studentId, studentClass, rollNo, email)) {
        return;
    }
    if (editIndex !== "") {
        updateStudent(parseInt(editIndex), name, studentId, studentClass, rollNo, email);
        resetForm();
    }
});

// deleteStudent will delete student data from the table and local storage
function deleteStudent(btn) {
    if (confirm("Are you sure you want to delete this record?")) {
        const row = btn.parentElement.parentElement;
        const index = Array.from(row.parentNode.children).indexOf(row);
        row.remove();
        removeStudentFromLocalStorage(index);
    }
}

// removeStudentFromLocalStorage this functionwill remove student from local storage
function removeStudentFromLocalStorage(index) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
}

// reseting the form
function resetForm() {
    document.getElementById('student-form').reset();
    document.getElementById('edit-index').value = "";
    document.getElementById('updateButton').style.display = "none";
    document.querySelector('.btn[type="submit"]').style.display = "inline-block";
}

function updateScroll() {
    const tableSection = document.querySelector('.table-section'); // Get the table container
    const tableBody = document.getElementById('table-body'); // Get the table body

    if (tableBody.rows.length > 5) { // enable scrolling after 5 rows
        tableSection.style.maxHeight = "400px"; // Seting max height for scrolling
        tableSection.style.overflowY = "auto"; // enabling vertical scrolling
    } else {
        tableSection.style.maxHeight = "none"; // Removing scroll if less than 6 rows
        tableSection.style.overflowY = "visible";
    }
}
