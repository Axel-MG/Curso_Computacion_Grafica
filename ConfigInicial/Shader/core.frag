#version 330 core
in vec3 ourColor;

out vec4 color;

uniform vec3 uColor; 

void main()
{
	color = vec4(uColor, 1.0);
}