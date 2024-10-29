from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import User, AdoptantProfile

class AdoptantRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = 'ADOPTANT'
        user.email = self.cleaned_data['email']
        user.phone = self.cleaned_data['phone']
        if commit:
            user.save()
        return user

class AdoptantProfileForm(forms.ModelForm):
    birth_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        required=True
    )
    
    class Meta:
        model = AdoptantProfile
        exclude = ('user', 'created_at', 'updated_at')
        widgets = {
            'adoption_motivation': forms.Textarea(attrs={'rows': 4}),
        }

    def clean_number_of_pets(self):
        has_other_pets = self.cleaned_data.get('has_other_pets')
        number_of_pets = self.cleaned_data.get('number_of_pets')

        if has_other_pets and number_of_pets == 0:
            raise ValidationError('Se possui outros animais, informe a quantidade.')
        if not has_other_pets and number_of_pets > 0:
            raise ValidationError('Se não possui outros animais, a quantidade deve ser zero.')
        
        return number_of_pets