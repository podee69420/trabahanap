const API_BASE = '/api';
let allJobSeekers = [];
let currentUserId = localStorage.getItem('userId') || null;

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    loadBaranggays();
    loadJobSeekers();
    loadMyProfiles();
    setupEventListeners();
    showSection('welcome');
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('profileForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput').addEventListener('keyup', filterJobSeekers);
    document.getElementById('barangayFilter').addEventListener('change', filterJobSeekers);
}

// Load baranggays into dropdown
async function loadBaranggays() {
    try {
        const response = await fetch(`${API_BASE}/baranggays`);
        const baranggays = await response.json();
        const select = document.getElementById('barangay');
        
        baranggays.forEach(barangay => {
            const option = document.createElement('option');
            option.value = barangay;
            option.textContent = barangay;
            select.appendChild(option);
        });

        // Also populate filter
        const filterSelect = document.getElementById('barangayFilter');
        baranggays.forEach(barangay => {
            const option = document.createElement('option');
            option.value = barangay;
            option.textContent = barangay;
            filterSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading baranggays:', error);
    }
}

// Load all job seekers for bulletin board
async function loadJobSeekers() {
    try {
        const response = await fetch(`${API_BASE}/job-seekers`);
        allJobSeekers = await response.json();
        displayJobSeekers(allJobSeekers);
    } catch (error) {
        console.error('Error loading job seekers:', error);
        showError('Failed to load job seekers');
    }
}

// Display job seekers in bulletin board
function displayJobSeekers(jobSeekers) {
    const container = document.getElementById('jobSeekersList');
    
    if (jobSeekers.length === 0) {
        container.innerHTML = '<p class="loading">No job seekers found. Be the first to post!</p>';
        return;
    }

    container.innerHTML = jobSeekers.map(seeker => `
        <div class="job-card">
            <div class="job-card-header">
                <div class="job-card-title">${escapeHtml(seeker.name)}</div>
                <span class="job-card-badge">${escapeHtml(seeker.barangay)}</span>
            </div>
            
            ${seeker.position_desired ? `<div class="job-card-field">
                <div class="job-card-label">Position Desired</div>
                <div class="job-card-value">${escapeHtml(seeker.position_desired)}</div>
            </div>` : ''}
            
            <div class="job-card-field">
                <div class="job-card-label">Address</div>
                <div class="job-card-value">${escapeHtml(seeker.address)}</div>
            </div>
            
            ${seeker.phone ? `<div class="job-card-field">
                <div class="job-card-label">📞 Phone</div>
                <div class="job-card-value">${escapeHtml(seeker.phone)}</div>
            </div>` : ''}
            
            <div class="job-card-field">
                <div class="job-card-label">📧 Email</div>
                <div class="job-card-value">${escapeHtml(seeker.email)}</div>
            </div>
            
            ${seeker.skills ? `<div class="job-card-field">
                <div class="job-card-label">Skills</div>
                <div class="job-card-value">${escapeHtml(seeker.skills)}</div>
            </div>` : ''}
            
            ${seeker.experience ? `<div class="job-card-field">
                <div class="job-card-label">Experience</div>
                <div class="job-card-value">${escapeHtml(seeker.experience)}</div>
            </div>` : ''}
            
            <div class="job-card-field">
                <div class="job-card-label">Posted</div>
                <div class="job-card-value">${formatDate(seeker.created_at)}</div>
            </div>
            
            ${seeker.facebook_link ? `<div class="job-card-links">
                <a href="${escapeHtml(seeker.facebook_link)}" target="_blank" class="social-link">
                    👤 Facebook Profile
                </a>
            </div>` : ''}
        </div>
    `).join('');
}

// Load my profiles
async function loadMyProfiles() {
    try {
        const response = await fetch(`${API_BASE}/job-seekers`);
        const jobSeekers = await response.json();
        const myEmail = localStorage.getItem('myEmail');
        
        let myProfiles = [];
        if (myEmail) {
            myProfiles = jobSeekers.filter(seeker => seeker.email === myEmail);
        }
        
        displayMyProfiles(myProfiles);
    } catch (error) {
        console.error('Error loading my profiles:', error);
    }
}

// Display my profiles with edit/delete options
function displayMyProfiles(profiles) {
    const container = document.getElementById('myProfilesList');
    
    if (profiles.length === 0) {
        container.innerHTML = '<p class="loading">No profiles yet. Post your first profile above!</p>';
        return;
    }

    container.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <div class="profile-card-header">
                <div class="profile-card-name">${escapeHtml(profile.name)}</div>
                <div class="profile-card-actions">
                    <button class="btn btn-primary btn-small" onclick="editProfile(${profile.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteProfile(${profile.id})">Delete</button>
                </div>
            </div>
            
            <div class="profile-card-info">
                <strong>📍 Location:</strong> ${escapeHtml(profile.barangay)}<br>
                <strong>🏠 Address:</strong> ${escapeHtml(profile.address)}<br>
                <strong>📧 Email:</strong> ${escapeHtml(profile.email)}<br>
                ${profile.phone ? `<strong>📞 Phone:</strong> ${escapeHtml(profile.phone)}<br>` : ''}
                ${profile.position_desired ? `<strong>💼 Position:</strong> ${escapeHtml(profile.position_desired)}<br>` : ''}
            </div>
        </div>
    `).join('');
}

// Handle form submission (Create/Update)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const profileId = document.getElementById('profileId').value;
    const formData = {
        name: document.getElementById('name').value,
        barangay: document.getElementById('barangay').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        position_desired: document.getElementById('position_desired').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        facebook_link: document.getElementById('facebook_link').value
    };

    // Save email to localStorage
    localStorage.setItem('myEmail', formData.email);

    try {
        let response;
        if (profileId) {
            // Update existing profile
            response = await fetch(`${API_BASE}/job-seekers/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new profile
            response = await fetch(`${API_BASE}/job-seekers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Error saving profile');
            return;
        }

        showSuccess(profileId ? 'Profile updated successfully!' : 'Profile posted successfully!');
        resetForm();
        loadJobSeekers();
        loadMyProfiles();
    } catch (error) {
        console.error('Error saving profile:', error);
        showError('Error saving profile');
    }
}

// Edit profile
async function editProfile(id) {
    try {
        const response = await fetch(`${API_BASE}/job-seekers/${id}`);
        const profile = await response.json();

        // Populate form with profile data
        document.getElementById('profileId').value = profile.id;
        document.getElementById('name').value = profile.name;
        document.getElementById('barangay').value = profile.barangay;
        document.getElementById('address').value = profile.address;
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('email').value = profile.email;
        document.getElementById('position_desired').value = profile.position_desired || '';
        document.getElementById('experience').value = profile.experience || '';
        document.getElementById('skills').value = profile.skills || '';
        document.getElementById('facebook_link').value = profile.facebook_link || '';

        // Scroll to form and switch section
        showSection('post-profile');
        document.getElementById('profileForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading profile for edit:', error);
        showError('Error loading profile');
    }
}

// Delete profile
async function deleteProfile(id) {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
        const response = await fetch(`${API_BASE}/job-seekers/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            showError('Error deleting profile');
            return;
        }

        showSuccess('Profile deleted successfully!');
        loadJobSeekers();
        loadMyProfiles();
    } catch (error) {
        console.error('Error deleting profile:', error);
        showError('Error deleting profile');
    }
}

// Filter job seekers
function filterJobSeekers() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const barangay = document.getElementById('barangayFilter').value;

    const filtered = allJobSeekers.filter(seeker => {
        const matchesSearch = 
            seeker.name.toLowerCase().includes(search) ||
            seeker.skills.toLowerCase().includes(search) ||
            seeker.barangay.toLowerCase().includes(search) ||
            seeker.position_desired.toLowerCase().includes(search);
        
        const matchesBarangay = !barangay || seeker.barangay === barangay;

        return matchesSearch && matchesBarangay;
    });

    displayJobSeekers(filtered);
}

// Reset form
function resetForm() {
    document.getElementById('profileForm').reset();
    document.getElementById('profileId').value = '';
}

// Show/hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show success message
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    
    const form = document.getElementById('profileForm');
    form.insertBefore(notification, form.firstChild);
    
    setTimeout(() => notification.remove(), 3000);
}

// Show error message
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'error-message';
    notification.textContent = message;
    
    const form = document.getElementById('profileForm');
    form.insertBefore(notification, form.firstChild);
    
    setTimeout(() => notification.remove(), 3000);
}